import z from "zod";
export const responseSchema = z.object({
    type: z.enum(['Success', 'Warning']),
    message: z.string(),
    data: z.any().optional(),
    error: z.any().optional(),
});
//# sourceMappingURL=generic.js.map