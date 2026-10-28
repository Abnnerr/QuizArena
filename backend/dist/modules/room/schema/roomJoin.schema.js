import z from "zod";
export const joinSchema = z.object({
    userName: z.string().min(2)
});
//# sourceMappingURL=roomJoin.schema.js.map