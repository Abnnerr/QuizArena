import z from "zod";
export declare const createAnswerSchema: z.ZodObject<{
    roundId: z.z.ZodCoercedNumber<unknown>;
    playerId: z.ZodString;
    alternativeId: z.z.ZodCoercedNumber<unknown>;
}, z.z.core.$strip>;
export type CreateAnswerDTO = z.infer<typeof createAnswerSchema>;
//# sourceMappingURL=createAnswer.schema.d.ts.map