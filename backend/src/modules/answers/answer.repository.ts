import { prisma } from "../../db/index.js";
import type { IAnswerRepository } from "./contracts/answer.repository.contract.js";

export class AnswerRepository implements IAnswerRepository {

    async createAnswer(roomId: number, roundId: number, playerId: string, alternativeId: number, scores: number): Promise<void> {
        await prisma.$transaction(async (tx) => {
            const updated = await tx.roomPlayer.updateMany({
                where: {
                    room_id: roomId,
                    player_id: playerId,
                    score: {
                        gte: Math.max(0, -scores),
                    },
                },
                data: {
                    score: {
                        increment: scores,
                    },
                },
            });

            if (updated.count === 0) {
                throw new Error(
                    "PLAYER_SCORE_NOT_UPDATED"
                );
            }

            await tx.answers.create({
                data: {
                    round_id: roundId,
                    player_id: playerId,
                    alternative_id: alternativeId,
                    points: scores,
                },
            });
        });
    }
}