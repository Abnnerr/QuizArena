
import { prisma } from "../../db/index.js"
import type { RoundWithQuestion, RoundWithRelations } from "./dto/round.dto.js"

export class RoundRepository {
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
    async findById(roomId?: number, roundId?: number, playerId?: string): Promise<RoundWithRelations | null> {

        return await prisma.round.findFirst({
            where: {
                closed_at: null,
                ...(roomId !== undefined && { room_id: roomId }),
                ...(roundId !== undefined && { round_id: roundId })
            },

            include: {
                rooms: {
                    select: {
                        time_limit: true,
                        position: true,
                        roomPlayers: {
                            ...(playerId && {
                                where: {
                                    player_id: playerId
                                }
                            }),
                            include: {
                                powerUpUses: {
                                    select: {
                                        used: true,
                                        powerup: {
                                            select: {
                                                powerup_id: true,
                                                powerup_type: true,
                                                descricao: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        _count: {
                            select: {
                                roomQuestions: true
                            }
                        }
                    }
                },
                answers: {
                    where: {
                        ...(playerId && { player_id: playerId })
                    },
                    select: {
                        answer_id: true,
                        round_id: true,
                        player_id: true,
                        alternative_id: true,
                        points: true,
                        answered_at: true
                    }
                },
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
        });
    }
    async updateRound(roundId: number) {
        try {
            await prisma.round.update({
                where: {
                    round_id: roundId
                },
                data: {
                    closed_at: new Date()
                }
            })
        } catch (error) {
            throw error
        }
    }

}