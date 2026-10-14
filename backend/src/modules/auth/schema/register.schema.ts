import z from "zod";

export const registerSchema = z.object({
    userName: z.string().min(3),
    email: z.email(),
    password: z.string()
        .min(8)
})

export type RegisterDTO = z.infer<typeof registerSchema>