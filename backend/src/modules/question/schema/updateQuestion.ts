import z from "zod";

export const updateQuestionSchema = z.object({
    room_id: z.number().int().positive().optional(),
    category_id: z.number().int().positive(),
    question_text: z.string().trim().min(1, "O enunciado é obrigatório"),
    question_type: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"]),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
    is_public: z.boolean(),
    alternatives: z.array(
        z.object({
            alternative_text: z.string()
                .trim()
                .min(1, "O texto da alternativa é obrigatório"),
            is_correct: z.boolean(),
        })
    )
        .min(2, "A pergunta precisa ter pelo menos duas alternativas")
        .max(4, "A pergunta pode ter no máximo quatro alternativas")
        .refine(
            (alternatives) =>
                alternatives.filter(item => item.is_correct).length === 1,
            {
                message: "A pergunta precisa ter exatamente uma alternativa correta",
            }
        ),
}).superRefine((data, ctx) => {
    if (
        data.question_type === "TRUE_FALSE" &&
        data.alternatives.length !== 2
    ) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Perguntas de verdadeiro ou falso precisam ter duas alternativas",
            path: ["alternatives"],
        });
    }

    if (data.question_type === "TRUE_FALSE") {
        const texts = data.alternatives.map(item =>
            item.alternative_text.toLowerCase()
        );

        if (
            !texts.includes("verdadeiro") ||
            !texts.includes("falso")
        ) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "As alternativas devem ser Verdadeiro e Falso",
                path: ["alternatives"],
            });
        }
    }
});

export type UpdateQuestionDTO = z.infer<typeof updateQuestionSchema>;