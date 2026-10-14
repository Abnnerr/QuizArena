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
    async findPlayer(name: string): Promise<Players | null> {
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