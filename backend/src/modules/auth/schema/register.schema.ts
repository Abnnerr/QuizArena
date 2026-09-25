import z from "zod";

export const registerSchema = z.object({
    name: z.string(),
    senha: z.string()
})

export type RegisterDTO = z.infer<typeof registerSchema>