import type { AnswerRepository } from "./answers.repository.js";

export class AnswerService {
    constructor(
        private readonly repo: AnswerRepository
    ) { }

    async createAnswer(roomCode: string, roundId: number, playerId: string, alternativeId: number) {
        try {
            console.log(roomCode, roundId, playerId, alternativeId);
            const room = await this.repo.findByRoom(undefined, roomCode);
            if (!room) {
                throw new Error("Sala não encontrada");
            }
            const round = await this.repoRound.findById(undefined, roundId);
            if (!round) {
                throw new Error("Rodada não encontrada");
            }
            const alternative = await this.repo.findAlternative(
                round.question_id,
                alternativeId
            );

            if (!alternative) {
                throw new Error("Alternativa não encontrada");
            }
            let scores = 0;
            if (alternative.is_correct) {
                const answeredAt = new Date();

                const elapsedSeconds = (answeredAt.getTime() - round.opened_at.getTime()) / 1000;

                const timeLimit = room.time_limit;
                const remainingSeconds = Math.max(
                    0,
                    Math.min(timeLimit, timeLimit - elapsedSeconds)
                );

                if (room.room_mode === "NORMAL") {
                    scores = Math.ceil(900 * remainingSeconds / timeLimit);
                } else if (room.room_mode === "HARDCORE") {
                    scores = Math.ceil(500 * remainingSeconds / timeLimit);
                }

            }
            await this.repoAnswer.createAnswer(roundId, playerId, alternativeId, scores)
            await this.playerService.updatePlayerScore(room.room_id!, playerId, scores)
            return {
                scores,
                isCorrect: alternative.is_correct,
            };
        } catch (error) {
            throw error;
        }
    }
}