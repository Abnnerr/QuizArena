
import { AppError } from "../../error/AppError.js";
import type { Players, RoomPlayer } from "@prisma/client";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { RoomService } from "../room/room.service.js";
import { PowerUpFactory } from "./services/powerup.factory.js";
import { Logger } from "../../shared/services/logger.service.js";
import { measure } from "../../observability/measure.js";
import type { IPlayerService } from "./contracts/player.service.contract.js";
import type { IPlayerRepository } from "./contracts/player.respository.contract.js";
import type { IPowerRepository } from "../powers/contracts/power.repository.contract.js";
import type { IRoundRepository } from "../round/contracts/round.repository.contract.js";


export class PlayerService implements IPlayerService {
    private roomService!: IRoomService;

    constructor(
        private readonly repo: IPlayerRepository,
        private readonly repoPower: IPowerRepository,
        private readonly repoRound: IRoundRepository,
        private readonly socket: SocketService
    ) { }



    setRoomService(roomService: RoomService) {
        this.roomService = roomService;
    }

    // Conta jogadores
    async countPlayers(roomId: number): Promise<number> {
        return measure("PlayerService.countPlayers", async () => {
            try {
                return await this.repo.countPlayers(roomId);
            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("PlayerService", "countPlayers.failed", error, {
                    roomId
                });

                throw new AppError(500, "Erro ao contar players");
            }
        });
    }
    // Cria jogador
    async createPlayer(name: string): Promise<Players> {
        return measure("PlayerService.createPlayer", async () => {
            try {
                Logger.info("PlayerService", "createPlayer.started", {
                    playerName: name
                });

                const player = await this.repo.findPlayer(name);

                if (player) {
                    Logger.warn("PlayerService", "createPlayer.name_already_used", {
                        playerName: name
                    });

                    throw new AppError(409, "Esse nome já está em uso");
                }

                const newPlayer = await this.repo.create(name);

                Logger.info("PlayerService", "createPlayer.completed", {
                    playerId: newPlayer.player_id
                });

                return newPlayer;

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("PlayerService", "createPlayer.failed", error);

                throw new AppError(500, "Erro ao criar player");
            }
        });
    }
    // Verifica se o jogador já está na sala
    async findPlayerRoom(username: string, roomId: number): Promise<RoomPlayer | null> {
        return measure("PlayerService.findPlayerRoom", async () => {
            try {
                const player = await this.repo.findPlayerRoom(username, roomId);

                if (player) {
                    Logger.warn("PlayerService", "findPlayerRoom.already_in_room", {
                        roomId,
                        playerId: player.player_id
                    });

                    throw new AppError(400, "Player já está na sala");
                }

                return player;

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("PlayerService", "findPlayerRoom.failed", error, {
                    roomId
                });

                throw new AppError(500, "Erro ao verificar player na sala");
            }
        });
    }
    // Player fica pronto ou não
    async readyPlayer(playerId: string, roomCode: string, ready: boolean): Promise<void> {
        return measure("PlayerService.readyPlayer", async () => {
            try {
                Logger.info("PlayerService", "readyPlayer.started", {
                    playerId,
                    roomCode,
                    ready
                });

                const room = await this.roomService.findRoom(roomCode);

                const isReady = await this.repo.readyPlayer(
                    playerId,
                    room.room_id,
                    ready
                );

                if (!isReady) {
                    throw new AppError(400, "Erro ao player ficar pronto");
                }

                this.socket.playerReady(
                    room.room_code,
                    isReady.player_id,
                    isReady.ready
                );

                Logger.info("PlayerService", "readyPlayer.completed", {
                    playerId,
                    roomId: room.room_id,
                    ready: isReady.ready
                });

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("PlayerService", "readyPlayer.failed", error, {
                    playerId,
                    roomCode
                });

                throw new AppError(500, "Erro ao atualizar status do player");
            }
        });
    }

    async updatePlayerScore(roomId: number, playerId: string, scores: number): Promise<void> {
        return measure("PlayerService.updatePlayerScore", async () => {
            try {
                Logger.info("PlayerService", "updatePlayerScore.started", {
                    roomId,
                    playerId,
                    points: scores
                });

                const playerScore = await this.repo.playerScore(roomId, playerId);

                const totalScore = (playerScore?.score ?? 0) + scores;

                if (totalScore < 0) {
                    throw new AppError(400, "Score negativo");
                }

                await this.repo.updatePlayerScore(
                    roomId,
                    playerId,
                    totalScore
                );

                Logger.info("PlayerService", "updatePlayerScore.completed", {
                    roomId,
                    playerId,
                    totalScore
                });

            } catch (error) {
                if (error instanceof AppError) throw error;
                Logger.error("PlayerService", "updatePlayerScore.failed", error, {
                    roomId,
                    playerId
                });
                throw new AppError(500, "Erro ao atualizar pontuação do player");
            }
        });
    }

    // Exclui jogador
    async deletePlayer(id: string): Promise<void> {
        return measure("PlayerService.deletePlayer", async () => {
            try {
                await this.repo.deletePlayer(id);

                Logger.info("PlayerService", "deletePlayer.completed", {
                    playerId: id
                });
            } catch (error) {
                if (error instanceof AppError) throw error;
                Logger.error("PlayerService", "deletePlayer.failed", error, {
                    playerId: id
                });
                throw new AppError(500, "Erro ao excluir player");
            }
        });
    }


    // Encontra o pódio
    async findPodium(code: string): Promise<(RoomPlayer & { players: { player_id: string; player_name: string; }; })[]> {
        return measure("PlayerService.findPodium", async () => {
            try {
                const room = await this.roomService.findRoom(code);

                const players = await this.repo.findPlayers(room.room_id);

                Logger.info("PlayerService", "findPodium.completed", {
                    roomId: room.room_id,
                    playersCount: players.length
                });

                return players;

            } catch (error) {
                if (error instanceof AppError) throw error;
                Logger.error("PlayerService", "findPodium.failed", error, {
                    roomCode: code
                });
                throw new AppError(500, "Erro ao buscar pódio");
            }
        });
    }


    // Usa um power-up
    async powerUp(code: string, playerId: string, powerId: number, targetPlayerId?: string, userName?: string): Promise<void> {
        return measure("PlayerService.powerUp", async () => {
            try {
                Logger.info("PlayerService", "powerUp.started", {
                    roomCode: code,
                    playerId,
                    powerId,
                    targetPlayerId
                });

                const room = await this.roomService.findRoom(code);

                const [power, round] = await Promise.all([
                    this.repoPower.findPowerById(powerId),
                    this.repoRound.findById(room.room_id)
                ]);

                if (!power) {
                    throw new AppError(404, "PowerUp não encontrado");
                }

                if (!round) {
                    throw new AppError(404, "Rodada não encontrada");
                }

                const strategy = PowerUpFactory.execute(power.powerup_type);

                await strategy({
                    code,
                    playerId,
                    roomId: room.room_id,
                    powerId: power.powerup_id,
                    position: room.position + 1,
                    roundId: round.round_id,
                    questionId: round.question_id,
                    targetPlayerId,
                    repoPower: this.repoPower,
                    roomService: this.roomService,
                    userName: userName,
                    socket: this.socket
                });

                Logger.info("PlayerService", "powerUp.completed", {
                    roomId: room.room_id,
                    playerId,
                    powerId,
                    powerType: power.powerup_type
                });

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("PlayerService", "powerUp.failed", error, {
                    roomCode: code,
                    playerId,
                    powerId
                });

                throw new AppError(500, "Erro ao utilizar power-up");
            }
        });
    }
}