import type { RoomQuestion } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { IQuestionRepository } from "./contracts/question.repository.contract.js";
import type { IQuestionService } from "./contracts/question.service.contract.js";
import type { QuestionCreateDTO } from "./dto/question.dto.js";


export class QuestionService implements IQuestionService {
    constructor(private readonly repo: IQuestionRepository) { }

    // Cria perguntas
    async createQuestions(questions: QuestionCreateDTO[]): Promise<number[]> {
        return measure("QuestionService.createQuestions", async () => {
            try {
                Logger.info("QuestionService", "createQuestions.started", {
                    questionsCount: questions.length
                });

                const someAlternative = questions.some(
                    item => item.alternatives.length > 4
                );

                const someQuestion = questions.length < 3;

                if (someQuestion) {
                    Logger.warn("QuestionService", "createQuestions.insufficient_questions", {
                        questionsCount: questions.length
                    });

                    throw new AppError(400, "Perguntas com menos de 3");
                }

                if (someAlternative) {
                    Logger.warn("QuestionService", "createQuestions.too_many_alternatives");

                    throw new AppError(400, "Alguma pergunta tem mais de 4 alternativas");
                }

                const questionIds = await this.repo.create(questions);

                Logger.info("QuestionService", "createQuestions.completed", {
                    questionsCount: questionIds.length
                });

                return questionIds;
            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("QuestionService", "createQuestions.failed", error);
                throw new AppError(500, "Erro ao criar perguntas");
            }
        });
    }



    // Encontra pergunta
    async findQuestion(roomId: number, position: number): Promise<RoomQuestion> {
        return measure("QuestionService.findQuestion", async () => {
            try {
                const question = await this.repo.findQuestion(roomId, position);

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
}