import z from "zod";
export declare const resetSchema: z.ZodObject<{
    password: z.ZodString;
}, z.z.core.$strip>;
export type ResetDTO = z.infer<typeof resetSchema>;
//# sourceMappingURL=reset.schema.d.ts.map