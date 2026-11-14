
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { RoomQuestion } from "@prisma/client";

import { QuestionService } from "../../../modules/question/question.service.js";
import { AppError } from "../../../error/AppError.js";

import type { IQuestionRepository } from "../../../modules/question/contracts/question.repository.contract.js";
import type { QuestionCreateDTO } from "../../../modules/question/dto/question.dto.js";

vi.mock("../../../observability/measure.js", () => ({
    measure: vi.fn(async (_name, callback) => callback())
}));

describe("QuestionService", () => {
    let service: QuestionService;

    const repo: IQuestionRepository = {
        create: vi.fn(),
        findQuestion: vi.fn()
    };

    const questionsMock = [
        {
            question_text: "Pergunta 1",
            alternatives: [
                { alternative_text: "A" },
                { alternative_text: "B" },
                { alternative_text: "C" },
                { alternative_text: "D" }
            ]
        },
        {
            question_text: "Pergunta 2",
            alternatives: [
                { alternative_text: "A" },
                { alternative_text: "B" },
                { alternative_text: "C" },
                { alternative_text: "D" }
            ]
        },
        {
            question_text: "Pergunta 3",
            alternatives: [
                { alternative_text: "A" },
                { alternative_text: "B" },
                { alternative_text: "C" },
                { alternative_text: "D" }
            ]
        }
    ] as unknown as QuestionCreateDTO[];

    const questionMock = {
        room_id: 1,
        question_id: 10,
        question_text: "Pergunta de teste",
        position: 1
    } as RoomQuestion;

    beforeEach(() => {
        vi.clearAllMocks();

        service = new QuestionService(repo);
    });

    describe("createQuestions", () => {
        it("deve criar perguntas com sucesso", async () => {
            vi.mocked(repo.create).mockResolvedValue([1, 2, 3]);

            const result = await service.createQuestions(questionsMock);

            expect(result).toEqual([1, 2, 3]);
            expect(repo.create).toHaveBeenCalledWith(questionsMock);
        });

        it("deve lançar erro quando houver menos de 3 perguntas", async () => {
            await expect(
                service.createQuestions(questionsMock.slice(0, 2))
            ).rejects.toThrow("Perguntas com menos de 3");

            expect(repo.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando alguma pergunta tiver mais de 4 alternativas", async () => {
            const question = questionsMock[2]!;

            const invalidQuestions: QuestionCreateDTO[] = [
                ...questionsMock.slice(0, 2),
                {
                    ...question,
                    alternatives: [
                        ...question.alternatives,
                        {
                            text: "Alternativa E",
                            isCorrect: false
                        }
                    ]
                }
            ];

            await expect(
                service.createQuestions(invalidQuestions)
            ).rejects.toThrow("Alguma pergunta tem mais de 4 alternativas");

            expect(repo.create).not.toHaveBeenCalled();
        });

        it("deve aceitar perguntas com exatamente 4 alternativas", async () => {
            vi.mocked(repo.create).mockResolvedValue([1, 2, 3]);

            const result = await service.createQuestions(questionsMock);

            expect(result).toEqual([1, 2, 3]);
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            vi.mocked(repo.create).mockRejectedValue(
                new AppError(400, "Erro do repository")
            );

            await expect(
                service.createQuestions(questionsMock)
            ).rejects.toThrow("Erro do repository");
        });

        it("deve lançar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(repo.create).mockRejectedValue(new Error("Database error"));

            await expect(
                service.createQuestions(questionsMock)
            ).rejects.toThrow("Erro ao criar perguntas");
        });
    });

    describe("findQuestion", () => {
        it("deve encontrar uma pergunta com sucesso", async () => {
            vi.mocked(repo.findQuestion).mockResolvedValue(questionMock);

            const result = await service.findQuestion(1, 1);

            expect(result).toEqual(questionMock);
            expect(repo.findQuestion).toHaveBeenCalledWith(1, 1);
        });

        it("deve lançar erro quando a pergunta não for encontrada", async () => {
            vi.mocked(repo.findQuestion).mockResolvedValue(null);

            await expect(
                service.findQuestion(1, 1)
            ).rejects.toThrow("question nao encontrado");
        });

        it("deve lançar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(repo.findQuestion).mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.findQuestion(1, 1)
            ).rejects.toThrow("Erro ao buscar pergunta");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            vi.mocked(repo.findQuestion).mockRejectedValue(
                new AppError(400, "Erro do repository")
            );

            await expect(
                service.findQuestion(1, 1)
            ).rejects.toThrow("Erro do repository");
        });
    });
});
