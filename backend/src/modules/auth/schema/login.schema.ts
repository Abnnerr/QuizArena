import z from "zod";

export const loginSchema = z.object({
    userName: z.string(),
    password: z.string()
})

export type LoginDTO = z.infer<typeof loginSchema>