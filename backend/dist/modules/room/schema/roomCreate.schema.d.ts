import z from "zod";
export declare const roomCreateSchema: z.ZodObject<{
    name: z.ZodString;
    maxPlayers: z.ZodNumber;
    timeLimit: z.ZodNumber;
    mode: z.ZodEnum<{
        NORMAL: "NORMAL";
        HARDCORE: "HARDCORE";
    }>;
    questions: z.ZodArray<z.ZodObject<{
        text: z.ZodString;
        alternatives: z.ZodArray<z.ZodObject<{
            text: z.ZodString;
            isCorrect: z.ZodBoolean;
        }, z.z.core.$strip>>;
    }, z.z.core.$strip>>;
}, z.z.core.$strip>;
export type RoomCreateDTO = z.infer<typeof roomCreateSchema>;
//# sourceMappingURL=roomCreate.schema.d.ts.map