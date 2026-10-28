import z from "zod";
export const registerSchema = z.object({
    userName: z.string().min(3),
    email: z.email(),
    password: z.string()
        .min(8)
});
//# sourceMappingURL=register.schema.js.map