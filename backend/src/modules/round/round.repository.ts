
import { prisma } from "../../db/index.js"
import type { RoundWithQuestion } from "./dto/round.dto.js"

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
    async findById(roomId?: number, roundId?: number) {

        return await prisma.round.findFirst({
            where: {
                ...(roomId && { room_id: roomId! }),
                ...(roundId && { round_id: roundId! }),
                closed_at: null,
            },
            include: {
                rooms: {
                    select: {
                        time_limit: true,
                        position: true,
                        _count: {
                            select: {
                                roomQuestions: true,
                            },
                        },
                    }
                },
                questions: {
                    select: {
                        question_id: true,
                        question_text: true,
                        alternatives: {
                            select: {
                                alternative_id: true,
                                alternative_text: true,
                            },
                        },
                    },
                },
            },
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