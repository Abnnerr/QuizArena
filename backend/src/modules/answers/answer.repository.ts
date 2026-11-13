import { prisma } from "../../db/index.js";

export class AnswerRepository {
    async createAnswer(roundId: number, playerId: string, alternativeId: number, points: number) {
        console.log(roundId, playerId, alternativeId, points);
        
        try {
            await prisma.answers.create({
                data: {
                    round_id: roundId,
                    player_id: playerId,
                    alternative_id: alternativeId,
                    points
                }
            })
        } catch (error) {
            throw error
        }
    }
}