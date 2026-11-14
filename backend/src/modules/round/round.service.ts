
import { AppError } from "../../error/AppError.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { IPowerRepository } from "../powers/contracts/power.repository.contract.js";
import type { IQuestionService } from "../question/contracts/question.service.contract.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { IRoundRepository } from "./contracts/round.repository.contract.js";
import type { IRoundService } from "./contracts/round.service.contract.js";
import type { RoundResponseDTO } from "./dto/round.dto.js";

export class RoundService implements IRoundService {
    constructor(
        private readonly repo: IRoundRepository,
        private readonly roomService: IRoomService,
        private readonly questionService: IQuestionService,
        private readonly repoPower: IPowerRepository,
        private readonly socket: SocketService,
    ) { }
    async findRound(roomCode: string, playerId?: string): Promise<RoundResponseDTO> {
        return measure("RoundService.findRound", async () => {
            const context = "RoundService";

            try {
                Logger.debug(context, "findRound.started", {
                    roomCode,
                    hasPlayer: Boolean(playerId)
                });

                const room = await this.roomService.findRoom(roomCode);

                const round = await this.repo.findById(
                    room.room_id,
                    undefined,
                    playerId
                );

                if (!round) {
                    Logger.warn(context, "findRound.not_found", {
                        roomCode,
                        roomId: room.room_id,
                        playerId
                    });

                    throw new AppError(404, "Nenhuma rodada ativa encontrada");
                }

                let skip = false;

                if (playerId) {
                    const [power, fifty] = await Promise.all([
                        this.repoPower.findPowerTarget(
                            playerId,
                            room.room_id,
                            round.round_id,
                            "SKIP_TURN"
                        ),
                        this.repoPower.findPowerPlayer(
                            playerId,
                            room.room_id,
                            "FIFTY_FIFTY"
                        )
                    ]);

                    skip = Boolean(power);

                    Logger.debug(context, "findRound.powerups_checked", {
                        playerId,
                        roundId: round.round_id,
                        skip,
                        fiftyUsed: Boolean(fifty?.used)
                    });
                }

                const result = {
                    round_id: round.round_id,
                    round_opened: round.opened_at,
                    server_now: new Date(),
                    question_id: round.questions.question_id,
                    question_text: round.questions.question_text,
                    alternatives: round.questions.alternatives,
                    time_limit: round.rooms.time_limit,
                    count_questions: round.rooms._count.roomQuestions,
                    position: round.rooms.position,

                    ...(playerId && {
                        powers: round.rooms.roomPlayers
                            .find(player => player.player_id === playerId)
                            ?.powerUpUses.map(use => ({
                                powerup_id: use.powerup.powerup_id,
                                powerup_type: use.powerup.powerup_type,
                                descricao: use.powerup.descricao,
                                used: use.used
                            })) ?? []
                    }),
                    skip
                };

                Logger.info(context, "findRound.completed", {
                    roomCode,
                    roomId: room.room_id,
                    roundId: round.round_id,
                    playerId
                });

                return result;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error(
                    context,
                    "findRound.failed",
                    error,
                    { roomCode, playerId }
                );

                throw new AppError(500, "Erro ao encontrar round");
            }
        });
    }

    async roundFinished(roomCode: string, round_id: number): Promise<void> {
        return measure("RoundService.roundFinished", async () => {
            const context = "RoundService";

            try {
                Logger.info(context, "roundFinished.started", {
                    roomCode,
                    roundId: round_id
                });

                const room = await this.roomService.updateRoomPosition(roomCode);

                const question = await this.questionService.findQuestion(
                    room.room_id,
                    room.position
                );

                await Promise.all([
                    this.repo.updateRound(round_id),
                    this.repo.createRound(room.room_id, question.question_id)
                ]);

                Logger.info(context, "roundFinished.completed", {
                    roomCode: room.room_code,
                    roomId: room.room_id,
                    roundId: round_id,
                    questionId: question.question_id,
                    position: room.position
                });

                this.socket.findQuestion(room.room_code);

            } catch (error) {
                Logger.error(
                    context,
                    "roundFinished.failed",
                    error,
                    { roomCode, roundId: round_id }
                );

                if (error instanceof AppError) {
                    throw error;
                }

                throw new AppError(500, "Erro ao terminar e criar round");
            }
        });
    }

    // Verifica se o tempo terminou e impede novas respostas
    async roundExpired(code: string, roundId: number): Promise<void> {
        return measure("RoundService.roundExpired", async () => {
            const context = "RoundService";

            try {
                Logger.debug(context, "roundExpired.started", {
                    roomCode: code,
                    roundId
                });

                const room = await this.roomService.findRoom(code);

                const round = await this.repo.findById(
                    room.room_id,
                    roundId
                );

                if (!round) {
                    throw new AppError(404, "Rodada não encontrada");
                }

                if (round.closed_at) {
                    Logger.debug(context, "roundExpired.already_closed", {
                        roomCode: code,
                        roundId
                    });
                    return;
                }

                const openedAt = new Date(round.opened_at).getTime();

                if (!Number.isFinite(openedAt)) {
                    throw new AppError(400, "Data de abertura inválida");
                }

                const elapsedSeconds =
                    (Date.now() - openedAt) / 1000;

                if (elapsedSeconds < room.time_limit) {
                    Logger.debug(context, "roundExpired.not_expired", {
                        roomCode: code,
                        roundId,
                        elapsedSeconds,
                        timeLimit: room.time_limit
                    });
                    return;
                }

                const alternativesStatistic =
                    await this.roomService.getAnswerStatistics(
                        round.round_id,
                        round.question_id
                    );

                this.socket.roundExpired(code, alternativesStatistic);

                Logger.info(context, "roundExpired.completed", {
                    roomCode: code,
                    roundId: round.round_id,
                    elapsedSeconds
                });

            } catch (error: unknown) {
                Logger.error(
                    context,
                    "roundExpired.failed",
                    error,
                    { roomCode: code, roundId }
                );
                if (error instanceof AppError) {
                    throw error;
                }
                throw new AppError(500, "Erro ao terminar round");
            }
        });
    }
}
