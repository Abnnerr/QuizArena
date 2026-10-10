import z from "zod";

export const registerSchema = z.object({
    userName: z.string().min(3),
    email: z.email(),
    password: z.string()
        .min(8)
        .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula")
        .regex(/[a-z]/, "A senha deve conter uma letra minúscula")
        .regex(/[0-9]/, "A senha deve conter um número")
        .regex(/[^A-Za-z0-9]/, "A senha deve ter pelo menos um caractere especial")
})

export type RegisterDTO = z.infer<typeof registerSchema>