
import type { RoomQuestion } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { IQuestionRepository } from "./contracts/question.repository.contract.js";
import type { IQuestionService } from "./contracts/question.service.contract.js";
import type { CreateQuestionDTO } from "./schema/createQuestion.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { UpdateQuestionDTO } from "./schema/updateQuestion.js";


export class QuestionService implements IQuestionService {
    constructor(
        private readonly repo: IQuestionRepository,
        private readonly roomService: IRoomService
    ) { }

    // Cria uma pergunta
    async createQuestion(question: CreateQuestionDTO, user: AuthPayload): Promise<number> {
        return measure("QuestionService.createQuestion", async () => {
            try {
                Logger.info("QuestionService", "createQuestion.started", {
                    questionType: question.question_type,
                    alternativesCount: question.alternatives.length,
                });

                const alternativesCount = question.alternatives.length;

                if (question.question_type === "TRUE_FALSE") {
                    if (alternativesCount !== 2) {
                        throw new AppError(
                            400,
                            "Perguntas de verdadeiro ou falso devem ter exatamente 2 alternativas"
                        );
                    }
                }

                if (question.question_type === "MULTIPLE_CHOICE") {
                    if (alternativesCount < 4 || alternativesCount > 4) {
                        throw new AppError(
                            400,
                            "Perguntas de múltipla escolha devem 4 alternativas"
                        );
                    }
                }

                const correctAlternatives = question.alternatives.filter(
                    alternative => alternative.is_correct
                );

                if (correctAlternatives.length !== 1) {
                    throw new AppError(
                        400,
                        "A pergunta deve possuir exatamente uma alternativa correta"
                    );
                }

                const questionId = await this.repo.create(question, user.id);

                Logger.info("QuestionService", "createQuestion.completed", {
                    questionId,
                });

                return questionId;

            } catch (error) {
                console.log(error);

                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("QuestionService", "createQuestion.failed", error);
                throw new AppError(500, "Erro ao criar pergunta");
            }
        });
    }
    // async findQuestions(userId: string) {
    //     try {
    //         const result = await this.repo.findQuestions(userId)

    //         if (result.length === 0) {
    //             throw new AppError(400, 'lista vazia')
    //         }
    //         return result
    //     } catch (error) {
    //         if (error instanceof AppError) {
    //             throw error;
    //         }
    //         throw new AppError(500, "Erro ao buscar perguntas");
    //     }
    // }
    // Encontra pergunta
    async findQuestion(roomId: number, position?: number): Promise<RoomQuestion> {
        return measure("QuestionService.findQuestion", async () => {
            try {
                const question = await this.repo.findQuestion(roomId, position);

                console.log('chegou na question 1');
                
                if (!question) {
                    Logger.warn("QuestionService", "findQuestion.not_found", {
                        roomId,
                        position
                    });
                    throw new AppError(400, "question nao encontrado")
                }

                return question;
            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("QuestionService", "findQuestion.failed", error, {
                    roomId,
                    position
                });
                throw new AppError(500, "Erro ao buscar pergunta");
            }
        });
    }


    async updateQuestion(questionId: number, question: UpdateQuestionDTO, userId: string): Promise<void> {
        try {
            await this.repo.updateQuestion(
                questionId,
                question,
                userId
            );
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, "Erro ao buscar perguntas");
        }
    }
    async deleteQuestionRoom(roomId: number, questionId: number, userId: string): Promise<void> {
        try {
            const room = await this.roomService.findRoom(undefined, roomId)

            if (room.host_user_id !== userId) {
                throw new AppError(409, 'voce nao e dono da sala')
            }
            await this.repo.deleteQuestionRoom(roomId, questionId)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, "Erro ao buscar perguntas");
        }
    }
    async deleteQuestion(questionId: number, userId: string): Promise<void> {
        try {
            const question = await this.repo.findQuestionById(questionId)

            if (question?.user_id !== userId) {
                throw new AppError(409, 'voce nao e dono da question')
            }
            await this.repo.deleteQuestion(questionId)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, "Erro ao buscar perguntas");
        }
    }
    async addToRoom(roomId: number, questionId: number, userId: string): Promise<void> {
        try {
            const question = await this.repo.addtoRoom(roomId, questionId)

            if (!question) {
                throw new AppError(400, 'Question ja cadastrado nessa sala')
            }
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, "Erro ao buscar perguntas");
        }
    }
}