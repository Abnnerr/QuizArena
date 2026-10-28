import type { Prisma } from "@prisma/client";
export type RoomWithPlayers = Prisma.RoomsGetPayload<{
    include: {
        roomPlayers: {
            select: {
                players: true;
                ready: true;
            };
        };
    };
}>;
export type FindQuestion = {
    round_id: number;
    question: {
        question_id: number;
        question_text: string;
        alternatives: [];
    };
    time_limit: number;
};
//# sourceMappingURL=room.dto.d.ts.map