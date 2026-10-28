import z from "zod";
export declare const loginSchema: z.ZodObject<{
    userName: z.ZodString;
    password: z.ZodString;
}, z.z.core.$strip>;
export type LoginDTO = z.infer<typeof loginSchema>;
//# sourceMappingURL=login.schema.d.ts.map