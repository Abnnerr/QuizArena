
import { prisma } from "../../db/index.js"
import { AppError } from "../../error/AppError.js";
import type { IRoundRepository } from "./contracts/round.repository.contract.js";
import type { RoundWithQuestion, RoundWithRelations } from "./dto/round.dto.js"

export class RoundRepository implements IRoundRepository {
    async createRound(roomId: number, questionId: number): Promise<RoundWithQuestion> {
        try {
            return await prisma.round.create({
                data: {
                    room_id: roomId,
                    question_id: questionId
                },
                include: {
                    questions: {
                        select: {
                            question_id: true,
                            question_text: true,
                            alternatives: {
                                select: {
                                    alternative_id: true,
                                    alternative_text: true
                                }
                            }
                        }
                    }
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findById(
        roomId?: number,
        roundId?: number,
        playerId?: string,
        checkAllAnswers: boolean = false
    ): Promise<RoundWithRelations | null> {

        return await prisma.round.findFirst({
            where: {
                ...(roomId && { room_id: roomId }),
                ...(roundId && { round_id: roundId }),
                closed_at: null,
            },
            include: {
                _count: {
                    select: {
                        answers: true,
                    },
                },

                rooms: {
                    select: {
                        time_limit: true,
                        position: true,
                        room_status: true,

                        _count: {
                            select: {
                                roomPlayers: true,
                                roomQuestions: true,
                            },
                        },

                        roomPlayers: {
                            ...(!checkAllAnswers && playerId
                                ? {
                                    where: {
                                        player_id: playerId,
                                    },
                                }
                                : {}),

                            select: {
                                player_id: true,
                                powerUpUses: {
                                    select: {
                                        used: true,
                                        powerup: {
                                            select: {
                                                powerup_type: true,
                                                descricao: true,
                                                powerup_id: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },

                answers: {
                    where: {
                        ...(!checkAllAnswers && playerId && {
                            player_id: playerId,
                        }),
                    },
                    select: {
                        player_id: true,
                        alternative_id: true,
                    },
                },

                questions: {
                    select: {
                        question_id: true,
                        question_text: true,
                        alternatives: {
                            select: {
                                alternative_id: true,
                                alternative_text: true,
                                is_correct: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateRound(roundId: number): Promise<void> {
        try {
            const result = await prisma.round.updateMany({
                where: {
                    round_id: roundId,
                    closed_at: null
                },
                data: {
                    closed_at: new Date()
                }
            });

            if (result.count === 0) {
                throw new AppError(
                    409,
                    "Esta rodada já foi finalizada"
                );
            }
        } catch (error) {
            throw error
        }
    }

    async finishRound(roundId: number, roomId: number, questionId: number): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const closedRound = await tx.round.updateMany({
                where: {
                    round_id: roundId,
                    closed_at: null
                },
                data: {
                    closed_at: new Date()
                }
            });
            if (closedRound.count === 0) {
                throw new AppError(409, "Esta rodada já foi finalizada");
            }
            await tx.round.create({
                data: {
                    room_id: roomId,
                    question_id: questionId
                }
            });
        });
    }
}