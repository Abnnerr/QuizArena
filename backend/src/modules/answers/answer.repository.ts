import { prisma } from "../../db/index.js";
import type { IAnswerRepository } from "./contracts/answer.repository.contract.js";

export class AnswerRepository implements IAnswerRepository {
    async createAnswer(roundId: number, playerId: string, alternativeId: number, points: number): Promise<void> {

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