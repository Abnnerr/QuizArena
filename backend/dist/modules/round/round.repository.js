import { prisma } from "../../db/index.js";
export class RoundRepository {
    async createRound(roomId, questionId) {
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
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findById(roomId, roundId, playerId) {
        return await prisma.round.findFirst({
            where: {
                ...(roomId && { room_id: roomId }),
                ...(roundId && { round_id: roundId }),
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
                answers: {
                    where: {
                        ...(playerId && { player_id: playerId })
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
    async updateRound(roundId) {
        try {
            await prisma.round.update({
                where: {
                    round_id: roundId
                },
                data: {
                    closed_at: new Date()
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=round.repository.js.map