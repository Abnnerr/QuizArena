import { AppError } from "../../error/AppError.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { IPlayerService } from "../players/contracts/player.service.contract.js";
import type { IPowerService } from "../powers/contracts/power.service.contract.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { IRoundService } from "../round/contracts/round.service.contract.js";
import type { IAnswerRepository } from "./contracts/answer.repository.contract.js";
import type { IAnswerService } from "./contracts/answer.service.contract.js";
import { ScoreFactory } from "./services/score.factory.js";
import { applyMultiplier } from "./services/strategies/multiplier.js";

export class AnswerService implements IAnswerService {
    constructor(
        private readonly repo: IAnswerRepository,
        private readonly roomService: IRoomService,
        private readonly roundService: IRoundService,
        private readonly powerService: IPowerService,
        private readonly playerService: IPlayerService
    ) { }

    // Cria resposta e pontuação do player
    async createAnswer(roomCode: string, roundId: number, playerId: string, alternativeId: number): Promise<{ scores: number; isCorrect: boolean; }> {
        return measure("AnswerService.createAnswer", async () => {
            try {
                Logger.info("AnswerService", "createAnswer.started", {
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                });

                const room = await this.roomService.findRoom(roomCode);

                const round = await this.roundService.findRound(room.room_code);

                const alreadyAnswered = round.answers.some(
                    answer => answer.player_id === playerId
                );
                
                if (alreadyAnswered) {
                    Logger.warn("AnswerService", "createAnswer.duplicate_answer", {
                        roomCode,
                        roundId: round.round_id,
                        playerId
                    });

                    throw new AppError(409, "Você já respondeu a esta rodada");
                }
                const [power, powerSkip, alternative] = await Promise.all([
                    this.powerService.findPowerPlayer(
                        playerId,
                        room.room_id,
                        "DOUBLE_XP"
                    ),
                    this.powerService.findPowerTarget(
                        playerId,
                        room.room_id,
                        round.round_id,
                        "SKIP_TURN"
                    ),
                    this.roomService.findAlternatives(
                        round.question_id,
                        alternativeId
                    )
                ]);

                if (!alternative) {
                    throw new AppError(404, "Alternativa não encontrada");
                }
                const skip = Boolean(powerSkip);

                if (skip) {
                    Logger.warn("AnswerService", "createAnswer.player_skipped", {
                        playerId,
                        roomCode,
                        roundId
                    });

                    throw new AppError(400, "Erro: você pulou essa rodada");
                }

                let scores = 0;
                const timeLimit = room.time_limit;

                if (alternative?.is_correct) {
                    const answeredAt = Date.now();
                    const openedAt = new Date(round.round_opened).getTime();

                    const elapsedSeconds = Math.max(
                        0,
                        (answeredAt - openedAt) / 1000
                    );

                    const remainingSeconds = Math.max(
                        0,
                        Math.min(timeLimit, timeLimit - elapsedSeconds)
                    );

                    const strategy = ScoreFactory.execute(room.room_mode);

                    const baseScore = strategy.calculate(
                        remainingSeconds,
                        timeLimit
                    );

                    const multiplier =
                        power?.position === room.position && power.used === true
                            ? 2
                            : 1;

                    scores = applyMultiplier(baseScore, multiplier);
                } else if (room.room_mode === "HARDCORE") {
                    scores = -30;
                }

                await Promise.all([
                    this.repo.createAnswer(
                        roundId,
                        playerId,
                        alternativeId,
                        scores
                    ),
                    this.playerService.updatePlayerScore(
                        room.room_id,
                        playerId,
                        scores
                    )
                ]);

                Logger.info("AnswerService", "createAnswer.completed", {
                    roomId: room.room_id,
                    roundId,
                    playerId,
                    isCorrect: alternative?.is_correct,
                    scores
                });

                return {
                    scores,
                    isCorrect: alternative?.is_correct
                };

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("AnswerService", "createAnswer.failed", error, {
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                });

                throw new AppError(500, "Erro ao criar resposta");
            }
        });
    }
}