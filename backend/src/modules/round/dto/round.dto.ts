import { Prisma } from "@prisma/client";

export type RoundWithQuestion = Prisma.RoundGetPayload<{
    include: {
        questions: {
            select: {
                question_id: true;
                question_text: true;
                alternatives: {
                    select: {
                        alternative_id: true;
                        alternative_text: true;
                    };
                };
            };
        };
    };
}>;


export const roundWithRelations = Prisma.validator<Prisma.RoundDefaultArgs>()({
    include: {
        rooms: {
            select: {
                time_limit: true,
                position: true,
                roomPlayers: {
                    include: {
                        powerUpUses: {
                            include: {
                                powerup: {
                                    select: {
                                        powerup_type: true,
                                        descricao: true,
                                        powerup_id: true
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
        answers: true,
        questions: {
            select: {
                question_id: true,
                question_text: true,
                alternatives: {
                    select: {
                        alternative_id: true,
                        alternative_text: true,
                        is_correct: true
                    }
                }
            }
        }
    }
});

export type RoundWithRelations = Prisma.RoundGetPayload<typeof roundWithRelations>;