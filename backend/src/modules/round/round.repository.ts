import { prisma } from "../../db/index.js"

export class RoundRepository {
    async create(roomId: number, questionId: number): Promise<void> {
        try {
            await prisma.round.create({
                data: {
                    room_id: roomId,
                    question_id: questionId
                }
            })
        } catch (error) {
            throw error
        }
    }
}