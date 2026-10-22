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