import type { PowerupType } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import type { PlayerRepository } from "../players/player.repository.js";
import type { PowerRepository } from "./powers.repository.js";

export class PowerService {
    constructor(
        private readonly repo: PowerRepository,
        private readonly repoPlayer: PlayerRepository
    ) { }


    //cria todos os power de cada player
    async createPowerPlayers(roomId: number) {
        try {
            const players = await this.repoPlayer.findPlayers(roomId)
            const ids = players.map(item => item.player_id)
            await this.repo.powerPlayers(ids, roomId)

        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar powers')
        }
    }
    //encontra um power do player
    async findPowerPlayer(playerId: string, roomId: number, namePower?: PowerupType) {
        try {
            const power = await this.repo.findPowerPlayer(playerId, roomId, namePower)

            return power
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao encontrar o power')
        }
    }

    async findPowerTarget(playerId: string, roomId: number, roundId: number, power: PowerupType) {
        try {
            const result = await this.repo.findPowerTarget(playerId, roomId, roundId, power)

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao encontrar o power')
        }
    }
}