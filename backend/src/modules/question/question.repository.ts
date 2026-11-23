
import type { Questions, RoomQuestion } from "@prisma/client"
import { prisma } from "../../db/index.js"
import type { IQuestionRepository } from "./contracts/question.repository.contract.js"
import type { CreateQuestionDTO } from "./schema/createQuestion.js";
import type { UpdateQuestionDTO } from "./schema/updateQuestion.js";
import { AppError } from "../../error/AppError.js";


export class QuestionRepository implements IQuestionRepository {
    async create(dados: CreateQuestionDTO, userId: string): Promise<number> {
        return prisma.$transaction(async (tx) => {

            // Cria a pergunta e suas alternativas
            const createdQuestion = await tx.questions.create({
                data: {
                    category_id: dados.category_id,
                    user_id: userId,
                    question_text: dados.question_text,
                    question_type: dados.question_type,
                    difficulty: dados.difficulty,
                    isPublic: dados.is_public,

                    alternatives: {
                        create: dados.alternatives.map((alternative) => ({
                            alternative_text: alternative.alternative_text,
                            is_correct: alternative.is_correct,
                        })),
                    },
                },
            });

            // Busca a última posição da sala
            const lastQuestion = await tx.roomQuestion.findFirst({
                where: {
                    room_id: dados.room_id,
                },
                orderBy: {
                    position: "desc",
                },
                select: {
                    position: true,
                },
            });

            const nextPosition = (lastQuestion?.position ?? 0) + 1;

            // Associa a pergunta à sala
            await tx.roomQuestion.create({
                data: {
                    room_id: dados.room_id,
                    question_id: createdQuestion.question_id,
                    position: nextPosition,
                },
            });

            return createdQuestion.question_id;
        });
    }
    // async findQuestions(userId: string): Promise<any> {
    //     try {
    //         return await prisma.questions.findMany({
    //             where: {
    //                 user_id: userId
    //             },
    //             include: {
    //                 category: true
    //             }
    //         })
    //     } catch (error) {

    //     }
    // }

    async findQuestion(roomId: number, position?: number): Promise<RoomQuestion | null> {
        try {
            const a = await prisma.roomQuestion.findFirst({
                where: {
                    room_id: roomId,
                    ...(position && { position: position })
                }
            });

            return a
        } catch (error) {
            throw error
        }
    }
    async findQuestionById(questionId: number): Promise<Questions | null> {
        try {
            const a = await prisma.questions.findFirst({
                where: {
                    question_id: questionId
                }
            });

            return a
        } catch (error) {
            throw error
        }
    }
    async updateQuestion(questionId: number, question: UpdateQuestionDTO, userId: string): Promise<void> {
        return await prisma.$transaction(async (tx) => {
            const questionFind = await tx.questions.findUnique({
                where: {
                    question_id: questionId,
                    user_id: userId
                }
            })

            if (!questionFind) {
                throw new AppError(404, 'Question nao encontrado')
            }

            await tx.alternatives.deleteMany({
                where: {
                    question_id: questionId,

                },
            });

            await tx.questions.update({
                where: {
                    question_id: questionId,
                    user_id: userId
                },
                data: {
                    category_id: question.category_id,
                    question_text: question.question_text,
                    question_type: question.question_type,
                    difficulty: question.difficulty,
                    isPublic: question.is_public,
                    alternatives: {
                        create: question.alternatives.map(alternative => ({
                            alternative_text: alternative.alternative_text,
                            is_correct: alternative.is_correct,
                        })),
                    },
                },
                include: {
                    alternatives: true,
                    category: true,
                },
            });
        });
    }
    async deleteQuestion(questionId: number): Promise<void> {
        await prisma.$transaction(async (tx) => {
            await tx.roomQuestion.deleteMany({
                where: {
                    question_id: questionId
                }
            })
            await tx.alternatives.deleteMany({
                where: {
                    question_id: questionId,
                },
            });

            await tx.questions.delete({
                where: {
                    question_id: questionId,
                },
            });
        });
    }
    async deleteQuestionRoom(roomId: number, questionId: number): Promise<void> {
        await prisma.roomQuestion.delete({
            where: {
                room_id_question_id: {
                    question_id: questionId,
                    room_id: roomId,
                }

            }
        })
    }

    async addtoRoom(roomId: number, questionId: number): Promise<any> {
        try {
            const existingQuestion = await prisma.roomQuestion.findUnique({
                where: {
                    room_id_question_id: {
                        room_id: roomId,
                        question_id: questionId,
                    },
                },
            });

            if (existingQuestion) {
                throw new Error("Essa pergunta já foi adicionada à sala.");
            }

            const lastQuestion = await prisma.roomQuestion.findFirst({
                where: {
                    room_id: roomId,
                },
                orderBy: {
                    position: "desc",
                },
                select: {
                    position: true,
                },
            });
            const position = (lastQuestion?.position ?? 0) + 1;

            return await prisma.roomQuestion.create({
                data: {
                    question_id: questionId,
                    room_id: roomId,
                    position,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}