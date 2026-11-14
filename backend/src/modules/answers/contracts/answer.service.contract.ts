
export type IAnswerService = {
    createAnswer(
        roomCode: string,
        roundId: number,
        playerId: string,
        alternativeId: number
    ): Promise<{
        scores: number;
        isCorrect: boolean;
    }>;
}
