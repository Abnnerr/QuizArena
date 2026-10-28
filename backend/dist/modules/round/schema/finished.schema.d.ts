import z from "zod";
export declare const finishedSchema: z.ZodObject<{
    round_id: z.ZodNumber;
}, z.z.core.$strip>;
export type FinishedDTO = z.infer<typeof finishedSchema>;
//# sourceMappingURL=finished.schema.d.ts.map