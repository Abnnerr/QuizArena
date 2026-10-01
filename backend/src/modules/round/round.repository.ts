import type { Round } from "@prisma/client"
import { prisma } from "../../db/index.js"

export class RoundRepository {
    async createRound(roomId: number, questionId: number): Promise<Round> {
        try {
            return await prisma.round.create({
                data: {
                    room_id: roomId,
                    question_id: questionId
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findById(roundId: number) {
        return await prisma.round.findUnique({
            where: {
                round_id: roundId
            },
            include: {
                questions: {
                    include: {
                        alternatives: {
                            select: {
                                alternative_id: true,
                                alternative_text: true
                            }
                        }
                    }
                }
            }
        })
    }
}