import z from "zod";
export declare const responseSchema: z.ZodObject<{
    type: z.ZodEnum<{
        Success: "Success";
        Warning: "Warning";
    }>;
    message: z.ZodString;
    data: z.ZodOptional<z.ZodAny>;
    error: z.ZodOptional<z.ZodAny>;
}, z.z.core.$strip>;
export type ResponseDTO = z.infer<typeof responseSchema>;
export type AuthPayload = {
    id: string;
    role: string;
    permissions: string[];
};
//# sourceMappingURL=generic.d.ts.map