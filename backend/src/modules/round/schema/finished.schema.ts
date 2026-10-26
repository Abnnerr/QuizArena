import z from "zod";

export const finishedSchema = z.object({
    round_id: z.number(),
})

export type FinishedDTO = z.infer<typeof finishedSchema>