import z from "zod";
export const createAnswerSchema = z.object({
    roundId: z.coerce.number(),
    playerId: z.string(),
    alternativeId: z.coerce.number()
});
//# sourceMappingURL=createAnswer.schema.js.map