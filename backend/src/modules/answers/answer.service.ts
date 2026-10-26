import { AppError } from "../../error/AppError.js";
import type { PlayerService } from "../players/player.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { RoomService } from "../room/room.service.js";
import type { RoundService } from "../round/round.service.js";
import type { AnswerRepository } from "./answer.repository.js";

export class AnswerService {
    constructor(
        private readonly repo: AnswerRepository,
        private readonly roomService: RoomService,
        private readonly roundService: RoundService,
        private readonly playerService: PlayerService
    ) { }

    async createAnswer(roomCode: string, roundId: number, playerId: string, alternativeId: number) {
        try {
            console.log(roomCode, roundId, playerId, alternativeId);
            const room = await this.roomService.findRoom(roomCode);
            if (!room) {
                throw new Error("Sala não encontrada");
            }

            const round = await this.roundService.findRound(room.room_code);
            if (!round) {
                throw new Error("Rodada não encontrada");
            }

            const alternative = await this.roomService.findAlternatives(
                round.question_id,
                alternativeId
            );

            console.log("alternativas:", alternative);

            if (!alternative) {
                throw new Error("Alternativa não encontrada");
            }
            let scores = 0;
            if (alternative.is_correct) {
                const answeredAt = new Date();

                const elapsedSeconds = (answeredAt.getTime() - new Date(round.round_opened).getTime()) / 1000;

                const timeLimit = room.time_limit;
                const remainingSeconds = Math.max(
                    0,
                    Math.min(timeLimit, timeLimit - elapsedSeconds)
                );

                if (room.room_mode === "NORMAL") {
                    scores = Math.ceil(900 * remainingSeconds / timeLimit);
                } else if (room.room_mode === "HARDCORE") {
                    scores = Math.ceil(500 * remainingSeconds / timeLimit);
                }

            }

            await this.repo.createAnswer(roundId, playerId, alternativeId, scores)
            await this.playerService.updatePlayerScore(room.room_id!, playerId, scores)
            return {
                scores,
                isCorrect: alternative.is_correct,
            };
        } catch (error) {
            console.error('Erro ao criar resposta:', error);
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar resposta')
        }
    }
}