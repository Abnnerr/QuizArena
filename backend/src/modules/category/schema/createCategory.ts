import z from "zod";

export const createCategorySchema = z.object({
    name: z.string()
})


export type CreateCategoryDTO = z.infer<typeof createCategorySchema>