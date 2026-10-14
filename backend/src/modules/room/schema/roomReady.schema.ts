import z from "zod";

export const readySchema = z.object({
    ready: z.boolean()
})

export type ReadyDTO = z.infer<typeof readySchema>