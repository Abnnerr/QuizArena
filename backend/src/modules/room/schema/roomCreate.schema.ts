import z from "zod";

export const roomCreateSchema = z.object({

    name: z.string().min(2),
    maxPlayers: z.number().int().min(2).max(30),
    timeLimit: z.number().int().min(1).max(90),
    mode: z.enum(["NORMAL", 'HARDCORE']),
})

export type RoomCreateDTO = z.infer<typeof roomCreateSchema>