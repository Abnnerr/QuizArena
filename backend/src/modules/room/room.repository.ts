
import { prisma } from "../../db/index.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { Prisma, Rooms, RoomStatus } from "@prisma/client";
import { randomBytes } from "node:crypto";
import type { RoomWithPlayers } from "./dto/room.dto.js";
import { AppError } from "../../error/AppError.js";


export class RoomRepository implements IRoomRepository {
    async createRoom(userId: string, dados: RoomCreateDTO): Promise<Rooms> {
        try {
            return await prisma.rooms.create({
                data: {
                    room_name: dados.name,
                    room_code: randomBytes(4).toString("hex").toUpperCase(),
                    room_mode: dados.mode,
                    max_players: dados.maxPlayers,
                    time_limit: dados.timeLimit,
                    host: {
                        connect: {
                            user_id: userId,
                        },
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findByRoom(name?: string,roomCode?: string,id?: number): Promise<RoomWithPlayers | null> {
        try {


            const where: Prisma.RoomsWhereInput = name
                ? { room_name: name }
                : roomCode
                    ? { room_code: roomCode }
                    : { room_id: id! };

            return await prisma.rooms.findFirst({
                where,
                include: {
                    roomPlayers: {
                        select: {
                            players: true,
                            ready: true,
                        },
                    },
                    roomQuestions: {
                        include: {
                            questions: {
                                include: {
                                    alternatives: true,
                                    category: true,
                                },
                            },
                        },
                    },
                },
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async findRooms(id: string): Promise<Rooms[] | null> {
        try {
            return await prisma.rooms.findMany({
                where: {
                    host_user_id: id,
                },
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async joinRoom(userId: string, roomId: number): Promise<void> {
        try {
            await prisma.roomPlayer.create({
                data: {
                    player_id: userId,
                    room_id: roomId,
                },
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async leaveRoom(id: string, roomId: number): Promise<void> {
        try {
            await prisma.roomPlayer.delete({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async countQuestions(id: number): Promise<number> {
        try {
            return prisma.roomQuestion.count({
                where: {
                    room_id: id,
                },
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    async roomUpdate(id: number, status?: string): Promise<Rooms> {
        try {
            return await prisma.rooms.update({
                where: {
                    room_id: id,
                },
                data: {
                    ...(status && {
                        room_status: status as RoomStatus,
                    }),
                    position: {
                        increment: 1,
                    },
                },
            });
        } catch (error) {
            throw error;
        }
    }

    async findAlternative(
        questionId: number,
        alternativeId?: number
    ): Promise<{ alternative_id: number; is_correct: boolean } | null> {
        return await prisma.alternatives.findFirst({
            where: {
                question_id: questionId,
                ...(alternativeId !== undefined
                    ? { alternative_id: alternativeId }
                    : { is_correct: true }),
            },
            select: {
                alternative_id: true,
                is_correct: true,
            },
        });
    }

    async findAlternativeIncorret(
        questionId: number
    ): Promise<{ alternative_id: number }[]> {
        try {
            const alternatives = await prisma.alternatives.findMany({
                where: {
                    question_id: questionId,
                    is_correct: false,
                },
                select: {
                    alternative_id: true,
                },
            });

            return alternatives
                .sort(() => Math.random() - 0.5)
                .slice(0, 2);
        } catch (error) {
            throw error;
        }
    }

    async getAnswerStatistics(
        roundId: number,
        questionId: number
    ): Promise<{
        alternativeId: number;
        isCorrect: boolean;
        count: number;
    }[]> {
        try {
            const [alternatives, answers] = await Promise.all([
                prisma.alternatives.findMany({
                    where: {
                        question_id: questionId,
                    },
                    select: {
                        alternative_id: true,
                        is_correct: true,
                    },
                }),

                prisma.answers.groupBy({
                    by: ["alternative_id"],
                    where: {
                        round_id: roundId,
                    },
                    _count: {
                        alternative_id: true,
                    },
                }),
            ]);

            const answerMap = new Map(
                answers.map(answer => [
                    answer.alternative_id,
                    answer._count.alternative_id,
                ])
            );

            return alternatives.map(alternative => ({
                alternativeId: alternative.alternative_id,
                isCorrect: alternative.is_correct,
                count: answerMap.get(alternative.alternative_id) ?? 0,
            }));
        } catch (error) {
            throw error;
        }
    }

    async limparRoom(roomId: number): Promise<void> {
        try {
            await prisma.$transaction(async (tx) => {
                const players = await tx.players.findMany({
                    where: {
                        roomPlayers: {
                            some: {
                                room_id: roomId,
                            },
                        },
                    },
                    select: {
                        player_id: true,
                    },
                });

                const roundIds = await tx.round.findMany({
                    where: {
                        room_id: roomId,
                    },
                    select: {
                        round_id: true,
                    },
                });

                await tx.answers.deleteMany({
                    where: {
                        round_id: {
                            in: roundIds.map(item => item.round_id),
                        },
                    },
                });

                await tx.powerUpUse.deleteMany({
                    where: {
                        room_id: roomId,
                    },
                });

                await tx.roomPlayer.deleteMany({
                    where: {
                        room_id: roomId,
                    },
                });

                await tx.players.deleteMany({
                    where: {
                        player_id: {
                            in: players.map(item => item.player_id),
                        },
                    },
                });

                await tx.round.deleteMany({
                    where: {
                        room_id: roomId,
                    },
                });

                await tx.rooms.update({
                    where: {
                        room_id: roomId,
                    },
                    data: {
                        room_status: "LOBBY",
                        position: 0,
                    },
                });
            });
        } catch (error) {
            throw error;
        }
    }

    async deletarRoom(roomId: number, userId: string): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const room = await tx.rooms.findFirst({
                where: {
                    room_id: roomId,
                },
            });

            if (!room) {
                throw new AppError(404, "Sala não encontrada");
            }

            if (room.host_user_id !== userId) {
                throw new AppError(403, "Você não é dono dessa sala");
            }

            const players = await tx.players.findMany({
                where: {
                    roomPlayers: {
                        some: {
                            room_id: roomId,
                        },
                    },
                },
                select: {
                    player_id: true,
                },
            });

            const playerIds = players.map(player => player.player_id);

            const rounds = await tx.round.findMany({
                where: {
                    room_id: roomId,
                },
                select: {
                    round_id: true,
                },
            });

            const roundIds = rounds.map(round => round.round_id);

            await tx.answers.deleteMany({
                where: {
                    round_id: {
                        in: roundIds,
                    },
                },
            });

            await tx.powerUpUse.deleteMany({
                where: {
                    room_id: roomId,
                },
            });

            await tx.roomPlayer.deleteMany({
                where: {
                    room_id: roomId,
                },
            });

            await tx.roomQuestion.deleteMany({
                where: {
                    room_id: roomId,
                },
            });

            await tx.round.deleteMany({
                where: {
                    room_id: roomId,
                },
            });

            if (playerIds.length > 0) {
                await tx.players.deleteMany({
                    where: {
                        player_id: {
                            in: playerIds,
                        },
                        roomPlayers: {
                            none: {},
                        },
                    },
                });
            }

            await tx.rooms.delete({
                where: {
                    room_id: roomId,
                },
            });
        });
    }
}
