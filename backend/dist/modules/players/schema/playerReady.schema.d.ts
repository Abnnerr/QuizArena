import z from "zod";
export declare const readySchema: z.ZodObject<{
    ready: z.ZodBoolean;
}, z.z.core.$strip>;
export type ReadyDTO = z.infer<typeof readySchema>;
//# sourceMappingURL=playerReady.schema.d.ts.map