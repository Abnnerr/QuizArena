import { AppError } from "../../error/AppError.js";
import type { PlayerRepository } from "./player.repository.js";

export class PlayerService {
    constructor(private readonly repo: PlayerRepository) { }

    async createPlayer(name: string) {
        try {
            let player = await this.repo.findPlayer(name)
            if (player) {
                throw new AppError(409, "Esse nome já está em uso");
            }
            return await this.repo.create(name)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }
    async deletePlayer(id: string) {
        try {
            await this.repo.delete(id)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }
}