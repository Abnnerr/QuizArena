
export type IAnswerRepository = {
    createAnswer(
        roundId: number,
        playerId: string,
        alternativeId: number,
        points: number
    ): Promise<void>;
}
