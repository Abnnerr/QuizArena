import { Roles, RoomStatus, type Rooms, type UserRoom } from "@prisma/client";
import { prisma } from "../../db/index.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { AuthPayload } from "../../types/generic.js";

export class RoomRepository implements IRoomRepository {
    async create(dados: RoomCreateDTO, ids: number[]): Promise<Rooms> {

        return await prisma.$transaction(async (tx) => {
            const room = await tx.rooms.create({
                data: {
                    room_name: dados.name,
                    max_players: dados.maxPlayers,
                    time_limit: dados.timeLimit,
                }
            })

            await tx.roomQuestion.createMany({
                data: ids.map((id, i,) => ({
                    room_id: room.room_id,
                    question_id: id,
                    position: i + 1
                }))
            })

            return room
        })
    }

    async findByRoom(name?: string, id?: number): Promise<Rooms | null> {
        try {
            const where = name ? { room_name: name } : { room_id: id! }
            return await prisma.rooms.findFirst({
                where
            })
        } catch (error) {
            throw error
        }
    }

    async join(user: AuthPayload, roomId: number): Promise<void> {
        try {
            await prisma.userRoom.create({
                data: {
                    user_id: user.id,
                    room_id: roomId,
                    is_host: user.role === Roles.host || user.role === Roles.admin
                }
            })
        } catch (error) {
            throw error
        }
    }
    async countPlayers(id: number): Promise<number> {
        try {
            return await prisma.userRoom.count({
                where: {
                    room_id: id
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findPlayer(id: string, roomId: number): Promise<UserRoom | null> {
        try {
            return await prisma.userRoom.findUnique({
                where: {
                    user_id_room_id: {
                        user_id: id,
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
            throw error
        }
    }

    async update(id: number, status: string): Promise<void> {
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
            throw error
        }
    }
}