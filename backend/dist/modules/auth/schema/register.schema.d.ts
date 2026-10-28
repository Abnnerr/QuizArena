import z from "zod";
export declare const registerSchema: z.ZodObject<{
    userName: z.ZodString;
    email: z.ZodEmail;
    password: z.ZodString;
}, z.z.core.$strip>;
export type RegisterDTO = z.infer<typeof registerSchema>;
//# sourceMappingURL=register.schema.d.ts.map