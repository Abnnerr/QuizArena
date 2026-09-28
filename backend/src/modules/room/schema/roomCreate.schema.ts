import z from "zod";

export const roomCreateSchema = z.object({

    name: z.string().min(2),
    maxPlayers: z.number().int().min(2).max(20),
    timeLimit: z.number().int().min(1).max(15),
    mode: z.enum(["NORMAL", 'HARDCORE']),
    questions: z.array(z.object({
        text: z.string(),
        alternatives: z.array(z.object({
            text: z.string(),
            isCorrect: z.boolean()
        }))
    }))
})

export type RoomCreateDTO = z.infer<typeof roomCreateSchema>