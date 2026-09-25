import z from "zod";

export const resetSchema = z.object({
    password: z.string()
        .min(8)
        .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula")
        .regex(/[a-z]/, "A senha deve conter uma letra minúscula")
        .regex(/[0-9]/, "A senha deve conter um número")
        .regex(/[^A-Za-z0-9]/, "A senha deve ter pelo menos um caractere especial")
})

export type ResetDTO = z.infer<typeof resetSchema>