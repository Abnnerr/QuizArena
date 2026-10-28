import { prisma } from "../../db/index.js";
import { randomBytes } from "node:crypto";
export class RoomRepository {
    async createRoom(userId, dados, ids) {
        return await prisma.$transaction(async (tx) => {
            const room = await tx.rooms.create({
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
            await tx.roomQuestion.createMany({
                data: ids.map((id, i) => ({
                    room_id: room.room_id,
                    question_id: id,
                    position: i + 1,
                })),
            });
            return room;
        });
    }
    async findByRoom(name, roomCode, id) {
        try {
            console.log(name);
            const where = name ? { room_name: name } : roomCode ? { room_code: roomCode } : { room_id: id };
            return await prisma.rooms.findFirst({
                where,
                include: {
                    roomPlayers: {
                        select: {
                            players: true,
                            ready: true,
                        }
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async joinRoom(userId, roomId) {
        try {
            await prisma.roomPlayer.create({
                data: {
                    player_id: userId,
                    room_id: roomId,
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async leaveRoom(id, roomId) {
        try {
            await prisma.roomPlayer.delete({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async countQuestions(id) {
        try {
            return prisma.roomQuestion.count({
                where: {
                    room_id: id
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async roomUpdate(id, status) {
        try {
            const room = await prisma.rooms.findFirst({
                where: {
                    room_id: id
                }
            });
            return await prisma.rooms.update({
                where: {
                    room_id: id
                },
                data: {
                    room_status: status,
                    position: room?.position + 1
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async findAlternative(questionId, alternativeId) {
        try {
            return await prisma.alternatives.findFirst({
                where: {
                    question_id: questionId,
                    alternative_id: alternativeId
                },
                select: {
                    is_correct: true
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async limparRoom(roomId) {
        try {
            const roundIds = await prisma.round.findMany({
                where: {
                    room_id: roomId
                },
                select: {
                    round_id: true
                }
            });
            await prisma.$transaction([
                prisma.answers.deleteMany({
                    where: {
                        round_id: {
                            in: roundIds.map(item => item.round_id),
                        }
                    },
                }),
                prisma.roomPlayer.deleteMany({
                    where: {
                        room_id: roomId,
                    },
                }),
                prisma.players.deleteMany({
                    where: {
                        roomPlayers: {
                            some: {
                                room_id: roomId,
                            },
                        },
                    },
                }),
                prisma.round.deleteMany({
                    where: {
                        room_id: roomId,
                    },
                }),
                prisma.rooms.update({
                    where: {
                        room_id: roomId
                    },
                    data: {
                        room_status: "LOBBY",
                        position: 0
                    }
                })
            ]);
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=room.repository.js.map