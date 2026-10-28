import z from "zod";
export declare const joinSchema: z.ZodObject<{
    userName: z.ZodString;
}, z.z.core.$strip>;
export type JoinDTO = z.infer<typeof joinSchema>;
//# sourceMappingURL=roomJoin.schema.d.ts.map