import z from "zod";

export const responseSchema = z.object({
    type: z.enum(['Success', 'Warning']),
    message: z.string(),
    data: z.any().optional(),
    error: z.any().optional(),

})

export type ResponseDTO = z.infer<typeof responseSchema>


export interface AuthPayload {
    id: string,
    role: string,
    permissions: string[]
}