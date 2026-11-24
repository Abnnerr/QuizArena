
export type IAnswerRepository = {
    createAnswer(
        roomId: number,
        roundId: number,
        playerId: string,
        alternativeId: number,
        scores: number
    ): Promise<void>
}
