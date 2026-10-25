import type { Players, RoomPlayer } from "@prisma/client";
import { prisma } from "../../db/index.js";

export class PlayerRepository {

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

    async create(name: string): Promise<Players> {
        try {
            return await prisma.players.create({
                data: {
                    player_name: name
                }
            })
        } catch (error) {
            throw error
        }
    }

    async findPlayerRoom(id: string, roomId: number): Promise<RoomPlayer | null> {
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
    async findPlayer(name: string, id?: string): Promise<Players | null> {
        try {
            return await prisma.players.findUnique({
                where: {
                    player_name: name
                }
            })
        } catch (error) {
            throw error
        }
    }

    async findPlayers(roomId: number) {
        try {
            return await prisma.roomPlayer.findMany({
                where: {
                    room_id: roomId,
                },
                orderBy: {
                    score: 'desc'
                }
            })
        } catch (error) {
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
    async playerScore(player_id: string) {
        try {
            return await prisma.roomPlayer.findFirst({
                where: {
                    player_id
                }, select: {
                    score: true
                }
            })
        } catch (error) {

        }
    }
    async updatePlayerScore(roomId: number, playerId: string, score: number) {
        try {
            await prisma.roomPlayer.update({
                where: {
                    room_id_player_id: {
                        player_id: playerId,
                        room_id: roomId
                    }

                },
                data: {
                    score
                }
            })
        } catch (error) {
            throw error
        }
    }
    async deletePlayer(id: string) {
        try {
            await prisma.players.delete({
                where: {
                    player_id: id
                }
            })
        } catch (error) {

        }
    }
}