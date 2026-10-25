import type { RoomQuestion } from "@prisma/client";
import { prisma } from "../../db/index.js"
import type { QuestionCreateDTO } from "./dto/question.dto.js"


export class QuestionRepository {
    async create(dados: QuestionCreateDTO[]): Promise<number[]> {
        try {
            return await prisma.$transaction(async (tx) => {

                const createdQuestions = await tx.questions.createManyAndReturn({
                    data: dados.map((question) => ({
                        question_text: question.text
                    }))
                })

                const alternatives = dados.flatMap((question, index) => question.alternatives.map((alternative) => ({
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

    async findQuestion(roomId: number, position: number): Promise<any> {
        try {

            console.log(roomId, position);

            const a = await prisma.roomQuestion.findFirst({
                where: {
                    room_id: roomId,
                    position: position,
                }
            });

            console.log(a);
            return a
        } catch (error) {
            throw error
        }
    }
}