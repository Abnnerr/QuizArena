import z from "zod";
export declare const forgotSchema: z.ZodObject<{
    email: z.ZodEmail;
}, z.z.core.$strip>;
export type ForgotDTO = z.infer<typeof forgotSchema>;
//# sourceMappingURL=forgot.schema.d.ts.map