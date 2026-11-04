import { AppError } from "../../error/AppError.js";
import type { PlayerService } from "../players/player.service.js";
import type { PowerService } from "../powers/powers.service.js";
import type { RoomService } from "../room/room.service.js";
import type { RoundService } from "../round/round.service.js";
import type { AnswerRepository } from "./answer.repository.js";
import { ScoreFactory } from "./services/score.factory.js";
import { applyMultiplier } from "./services/strategies/multiplier.js";

export class AnswerService {
    constructor(
        private readonly repo: AnswerRepository,
        private readonly roomService: RoomService,
        private readonly roundService: RoundService,
        private readonly powerService: PowerService,
        private readonly playerService: PlayerService
    ) { }

    // cria resposta e pontuacao do player
    async createAnswer(roomCode: string, roundId: number, playerId: string, alternativeId: number) {
        try {
            console.log(roomCode, roundId, playerId, alternativeId);
            const room = await this.roomService.findRoom(roomCode);
            if (!room) {
                throw new Error("Sala não encontrada");
            }

            const round = await this.roundService.findRound(room.room_code);

            const power = await this.powerService.findPowerPlayer(playerId, room.room_id, 'DOUBLE_XP')

            const alternative = await this.roomService.findAlternatives(
                round.question_id,
                alternativeId
            );

            let scores = 0;
            const timeLimit = room.time_limit;
            if (alternative.is_correct) {
                const answeredAt = new Date();
                const elapsedSeconds = (answeredAt.getTime() - new Date(round.round_opened).getTime()) / 1000;


                if (timeLimit <= 0) {
                    throw new AppError(400, 'Tempo limite inválido');
                }
                if (elapsedSeconds < 0) {
                    throw new AppError(400, 'Horário de resposta inválido');
                }
                if (elapsedSeconds > timeLimit) {
                    throw new AppError(400, 'Tempo da rodada encerrado');
                }

                const remainingSeconds = Math.max(0, Math.min(timeLimit, timeLimit - elapsedSeconds));

                const strategy = ScoreFactory.execute(room.room_mode);

                const baseScore = strategy.calculate(
                    remainingSeconds,
                    timeLimit
                );

                const multiplier = power?.position === room.position && power.used === true ? 2 : 1;

                scores = applyMultiplier(baseScore, multiplier);
            } else if (room.room_mode === 'HARDCORE') {
                scores -= 30
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