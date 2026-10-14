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
    async findById(roomId: number) {
        return await prisma.round.findFirst({
            where: {
                room_id: roomId
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

    async findByQuestion(roomId: number, questionId: number) {
        try {
            return await prisma.round.findFirst({
                where: {
                    room_id: roomId,
                    question_id: questionId
                }
            })
        } catch (error) {
            throw error
        }
    }
}