import type { RoundWithQuestion, RoundWithRelations } from "../dto/round.dto.js";

export type IRoundRepository = {
    createRound(
        roomId: number,
        questionId: number
    ): Promise<RoundWithQuestion>;

    findById(
        roomId?: number,
        roundId?: number,
        playerId?: string, 
        checkAllAnswers?: boolean
    ): Promise<RoundWithRelations | null>;

    updateRound: (roundId: number) => Promise<void>;
    finishRound: (roundId: number, roomId: number, questionId: number) => Promise<void>
}