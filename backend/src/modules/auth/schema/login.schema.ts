import z from "zod";

export const loginSchema = z.object({
    email: z.email(),
    senha: z.string()
})

export type LoginDTO = z.infer<typeof loginSchema>