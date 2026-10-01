import type { RoomQuestion } from "@prisma/client";
import { prisma } from "../../db/index.js"
import type { QuestionCreateDTO } from "./dto/question.dto.js"


export class QuestionRepository {
    async create(dados: QuestionCreateDTO): Promise<number[]> {
        try {
            console.log('chegou no question repo');

            return await prisma.$transaction(async (tx) => {

                const createdQuestions = await tx.questions.createManyAndReturn({
                    data: dados.questions.map((question) => ({
                        question_text: question.text
                    }))
                })

                const alternatives = dados.questions.flatMap((question, index) => question.alternatives.map((alternative) => ({
                    question_id: createdQuestions[index]!.question_id,

                    alternative_text: alternative.text,

                    is_correct: alternative.isCorrect
                }))
                )

                await tx.alternatives.createMany({
                    data: alternatives
                })

                return createdQuestions.map(item => item.question_id)
            })

        } catch (error) {
            throw error
        }
    }
    async findQuestion(roomId: number, position: number): Promise<RoomQuestion | null> {
        try {
            return await prisma.roomQuestion.findFirst({
                where: {
                    room_id: roomId,
                    position: position
                }
            })
        } catch (error) {
            throw error
        }
    }
}