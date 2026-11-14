import type { RoundResponseDTO } from "../dto/round.dto.js";

export type IRoundService = {
    findRound(
        roomCode: string,
        playerId?: string
    ): Promise<RoundResponseDTO>;

    roundFinished(
        roomCode: string,
        round_id: number
    ): Promise<void>;

    roundExpired(
        code: string,
        roundId: number
    ): Promise<void>;
}