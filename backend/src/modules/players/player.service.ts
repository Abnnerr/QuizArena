
import { AppError } from "../../error/AppError.js";
import type { PlayerRepository } from "./player.repository.js";
import type { RoomPlayer } from "@prisma/client";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { PowerRepository } from "../powers/powers.repository.js";
import type { RoomService } from "../room/room.service.js";
import type { RoundRepository } from "../round/round.repository.js";
import { PowerUpFactory } from "./services/powerup.factory.js";


export class PlayerService {
    private roomService!: IRoomService;

    constructor(
        private readonly repo: PlayerRepository,
        private readonly repoPower: PowerRepository,
        private readonly repoRound: RoundRepository,
        private readonly socket: SocketService
    ) { }



    setRoomService(roomService: RoomService) {
        this.roomService = roomService;
    }


    async countPlayers(roomId: number): Promise<number> {
        try {
            const players = await this.repo.countPlayers(roomId)

            return players
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao contar players')
        }
    }
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
    async findPlayerRoom(id: string, roomId: number): Promise<RoomPlayer | null> {
        try {
            const player = await this.repo.findPlayerRoom(id, roomId)

            if (player) {
                throw new AppError(400, 'player ja esta na sala')
            }

            return player
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }

    //player fica pronto ou nao
    async readyPlayer(playerId: string, roomCode: string, ready: boolean): Promise<void> {
        try {
            console.log(playerId, roomCode, ready);

            const room = await this.roomService.findRoom(roomCode)

            const isReady = await this.repo.readyPlayer(playerId, room.room_id, ready)
            if (!isReady) {
                throw new AppError(400, 'Erro ao player ficar pronto')
            }

            this.socket.playerReady(room?.room_code!, isReady.player_id, isReady.ready)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao ready player')
        }
    }

    async updatePlayerScore(roomId: number, playerId: string, scores: number) {
        try {
            const playerScore = await this.repo.playerScore(playerId)

            scores += playerScore?.score! + scores
            await this.repo.updatePlayerScore(roomId, playerId, scores)
        } catch (error) {

        }
    }
    async deletePlayer(id: string) {
        try {
            await this.repo.deletePlayer(id)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }

    async findPodium(code: string) {
        try {
            const room = await this.roomService.findRoom(code)
            const players = await this.repo.findPlayers(room.room_id)

            return players
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }

    //usa um power
    async powerUp(code: string, playerId: string, powerId: number, targetPlayerId?: string) {
        try {


            const room = await this.roomService.findRoom(code);
            const round = await this.repoRound.findById(room.room_id);
            const power = await this.repoPower.findPowerById(powerId);
            
            if (!room) {
                throw new AppError(404, "Sala não encontrada");
            }
            if (!power) {
                throw new AppError(404, "PowerUp não encontrado");
            }
            if (!round) {
                throw new AppError(404, "Rodada não encontrada");
            }

            const strategy = PowerUpFactory.execute(power.powerup_type)

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
                socket: this.socket
            })
            
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar player')
        }
    }
}