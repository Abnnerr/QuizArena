import z from "zod";

export const forgotSchema = z.object({
    email: z.email()
})


export type ForgotDTO = z.infer<typeof forgotSchema>