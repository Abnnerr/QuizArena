import z from "zod";

export const createLibrarySchema = z.object({
    title: z.string(),
    description: z.string()
})

export type CreateLibraryDTO = z.infer<typeof createLibrarySchema> 