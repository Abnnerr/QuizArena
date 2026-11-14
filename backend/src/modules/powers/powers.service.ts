import type { PowerupType, PowerUpUse } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { IPowerRepository } from "./contracts/power.repository.contract.js";
import type { IPlayerRepository } from "../players/contracts/player.respository.contract.js";
import type { IPowerService } from "./contracts/power.service.contract.js";

export class PowerService implements IPowerService {
    constructor(
        private readonly repo: IPowerRepository,
        private readonly repoPlayer: IPlayerRepository
    ) { }

    // Cria todos os powers de cada player
    async createPowerPlayers(roomId: number): Promise<void> {
        return measure("PowerService.createPowerPlayers", async () => {
            try {
                Logger.info("PowerService", "createPowerPlayers.started", {
                    roomId
                });

                const players = await this.repoPlayer.findPlayers(roomId);

                const ids = players.map(item => item.player_id);

                await this.repo.powerPlayers(ids, roomId);

                Logger.info("PowerService", "createPowerPlayers.completed", {
                    roomId,
                    playersCount: ids.length
                });

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("PowerService", "createPowerPlayers.failed", error, {
                    roomId
                });

                throw new AppError(500, "Erro ao criar powers");
            }
        });
    }

    // Encontra um power do player
    async findPowerPlayer(playerId: string, roomId: number, namePower?: PowerupType): Promise<PowerUpUse | null> {
        return measure("PowerService.findPowerPlayer", async () => {
            try {
                const power = await this.repo.findPowerPlayer(
                    playerId,
                    roomId,
                    namePower
                );

                return power;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("PowerService", "findPowerPlayer.failed", error, {
                    playerId,
                    roomId,
                    namePower
                });

                throw new AppError(500, "Erro ao encontrar o power");
            }
        });
    }

    // Encontra o power do alvo
    async findPowerTarget(playerId: string, roomId: number, roundId: number, power: PowerupType): Promise<PowerUpUse | null> {
        return measure("PowerService.findPowerTarget", async () => {
            try {
                const result = await this.repo.findPowerTarget(
                    playerId,
                    roomId,
                    roundId,
                    power
                );

                return result;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("PowerService", "findPowerTarget.failed", error, {
                    playerId,
                    roomId,
                    roundId,
                    power
                });

                throw new AppError(500, "Erro ao encontrar o power");
            }
        });
    }
}