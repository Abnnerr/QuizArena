import { prisma } from "../../db/index.js";

export class AnswerRepository {
    async createAnswer(roundId: number, playerId: string, alternativeId: number, points: number) {
        try {

            console.log('repo answer:', roundId, playerId, alternativeId, points);
            
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