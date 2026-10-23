import type { Players } from "@prisma/client";
import { prisma } from "../../db/index.js";

export class PlayerRepository {
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
    async delete(id: string) {
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