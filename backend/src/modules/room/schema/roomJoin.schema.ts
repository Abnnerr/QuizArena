import z from "zod";

export const joinSchema = z.object({
    userName: z.string().min(2)
})

export type JoinDTO = z.infer<typeof joinSchema>