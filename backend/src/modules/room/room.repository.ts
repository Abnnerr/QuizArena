
import { prisma } from "../../db/index.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { AuthPayload } from "../../types/generic.js";
import type { Prisma, RoomPlayer, Rooms, RoomStatus } from "@prisma/client";
import { randomBytes } from "node:crypto";
import type { RoomWithPlayers } from "./dto/room.dto.js";

export class RoomRepository implements IRoomRepository {
    async create(userId: string, dados: RoomCreateDTO, ids: number[]): Promise<Rooms> {

        return await prisma.$transaction(async (tx) => {
            const room = await tx.rooms.create({
                data: {
                    room_name: dados.name,
                    room_code: randomBytes(4).toString("hex").toUpperCase(),
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
        })
    }

    async findByRoom(name?: string, roomCode?: string, id?: number): Promise<RoomWithPlayers> {
        try {
            const where: Prisma.RoomsWhereInput = name ? { room_name: name } : roomCode ? { room_code: roomCode } : { room_id: id! }
            return await prisma.rooms.findFirstOrThrow({
                where,
                include: {
                    roomPlayers: {
                        select: {
                            players: true,
                            ready: true,
                        }
                    }
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async joinRoom(userId: string, roomId: number): Promise<void> {
        try {
            await prisma.roomPlayer.create({
                data: {
                    player_id: userId,
                    room_id: roomId,
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async leaveRoom(id: string, roomId: number): Promise<void> {
        try {
            await prisma.roomPlayer.delete({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                }
            })
        } catch (error) {
            throw error
        }
    }
    async countPlayers(id: number): Promise<number> {
        try {
            return await prisma.roomPlayer.count({
                where: {
                    room_id: id
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
    async findPlayer(id: string, roomId: number): Promise<RoomPlayer | null> {
        try {
            return await prisma.roomPlayer.findUnique({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                }
            })
        } catch (error) {
            throw error
        }
    }
    async countQuestions(id: number): Promise<number> {
        try {
            return prisma.roomQuestion.count({
                where: {
                    room_id: id
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async readyPlayer(id: string, roomId: number, ready: boolean): Promise<any> {
        try {
            return await prisma.roomPlayer.update({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                },
                data: {
                    ready
                }
            })
        } catch (error) {
            console.log(error);

            throw error
        }
    }
    async roomUpdate(id: number, status: string): Promise<void> {
        try {
            await prisma.rooms.update({
                where: {
                    room_id: id
                },
                data: {
                    room_status: status as RoomStatus
                }
            })
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}