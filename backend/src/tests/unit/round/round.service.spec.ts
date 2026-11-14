
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { AppError } from "../../../error/AppError.js";
import type { RoundWithRelations } from "../../../modules/round/dto/round.dto.js";
import { RoundService } from "../../../modules/round/round.service.js";
import type { RoomQuestion, Rooms } from "@prisma/client";
import type { IRoundRepository } from "../../../modules/round/contracts/round.repository.contract.js";
import type { IRoomService } from "../../../modules/room/contracts/room.service.contract.js";
import type { IQuestionService } from "../../../modules/question/contracts/question.service.contract.js";
import type { IPowerRepository } from "../../../modules/powers/contracts/power.repository.contract.js";
import type { SocketService } from "../../../shared/services/socket.service.js";


vi.mock("../../../observability/measure.js", () => ({
    measure: vi.fn(async (_name, callback) => callback())
}));

describe("RoundService", () => {
    let service: RoundService;

    const repo = {
        findById: vi.fn(),
        updateRound: vi.fn(),
        createRound: vi.fn()
    };

    const roomService = {
        findRoom: vi.fn(),
        updateRoomPosition: vi.fn(),
        getAnswerStatistics: vi.fn()
    };

    const questionService = {
        findQuestion: vi.fn()
    };

    const repoPower = {
        findPowerTarget: vi.fn(),
        findPowerPlayer: vi.fn()
    };

    const socket = {
        findQuestion: vi.fn(),
        roundExpired: vi.fn()
    };

    const roomMock = {
        room_id: 1,
        room_code: "ABC123",
        room_name: "Sala teste",
        time_limit: 10,
        position: 1
    } as unknown as Rooms;

    const roundMock = {
        round_id: 10,
        opened_at: new Date("2026-11-14T19:00:00"),
        closed_at: null,
        question_id: 20,
        questions: {
            question_id: 20,
            question_text: "Pergunta de teste",
            alternatives: [
                { alternative_id: 1, alternative_text: "A", is_correct: true },
                { alternative_id: 2, alternative_text: "B", is_correct: false }
            ]
        },
        rooms: {
            time_limit: 10,
            position: 1,
            _count: {
                roomQuestions: 3
            },
            roomPlayers: [
                {
                    player_id: "player-1",
                    powerUpUses: [
                        {
                            used: true,
                            powerup: {
                                powerup_id: 1,
                                powerup_type: "FIFTY_FIFTY",
                                descricao: "Remove duas alternativas"
                            }
                        }
                    ]
                }
            ]
        }
    } as unknown as RoundWithRelations;

    const questionMock = {
        question_id: 20,
        question_text: "Pergunta de teste"
    } as unknown as RoomQuestion;;

    const statisticsMock = [
        {
            alternativeId: 1,
            isCorrect: true,
            count: 5
        },
        {
            alternativeId: 2,
            isCorrect: false,
            count: 3
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        service = new RoundService(
            repo as unknown as IRoundRepository,
            roomService as unknown as IRoomService,
            questionService as unknown as IQuestionService,
            repoPower as unknown as IPowerRepository,
            socket as unknown as SocketService
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("findRound", () => {
        it("deve encontrar uma rodada sem player", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(roundMock);

            const result = await service.findRound("ABC123");

            expect(result).toMatchObject({
                round_id: 10,
                question_id: 20,
                question_text: "Pergunta de teste",
                time_limit: 10,
                count_questions: 3,
                position: 1,
                skip: false
            });

            expect(repo.findById).toHaveBeenCalledWith(
                1,
                undefined,
                undefined
            );

            expect(repoPower.findPowerTarget).not.toHaveBeenCalled();
            expect(repoPower.findPowerPlayer).not.toHaveBeenCalled();
        });

        it("deve encontrar uma rodada com os dados dos powers do player", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(roundMock);

            repoPower.findPowerTarget.mockResolvedValue({
                used: true
            });

            repoPower.findPowerPlayer.mockResolvedValue({
                used: true
            });

            const result = await service.findRound(
                "ABC123",
                "player-1"
            );

            expect(result).toMatchObject({
                round_id: 10,
                skip: true,
                powers: [
                    {
                        powerup_id: 1,
                        powerup_type: "FIFTY_FIFTY",
                        descricao: "Remove duas alternativas",
                        used: true
                    }
                ]
            });

            expect(repoPower.findPowerTarget).toHaveBeenCalledWith(
                "player-1",
                1,
                10,
                "SKIP_TURN"
            );

            expect(repoPower.findPowerPlayer).toHaveBeenCalledWith(
                "player-1",
                1,
                "FIFTY_FIFTY"
            );
        });

        it("deve retornar skip false quando o player não usou SKIP_TURN", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(roundMock);

            repoPower.findPowerTarget.mockResolvedValue(null);
            repoPower.findPowerPlayer.mockResolvedValue(null);

            const result = await service.findRound(
                "ABC123",
                "player-1"
            );

            expect(result.skip).toBe(false);
        });

        it("deve retornar powers vazio quando o player não estiver na sala", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            const roundWithoutPlayer = {
                ...roundMock,
                rooms: {
                    ...roundMock.rooms,
                    roomPlayers: []
                }
            } as unknown as RoundWithRelations;

            repo.findById.mockResolvedValue(roundWithoutPlayer);
            repoPower.findPowerTarget.mockResolvedValue(null);
            repoPower.findPowerPlayer.mockResolvedValue(null);

            const result = await service.findRound(
                "ABC123",
                "player-inexistente"
            );

            expect(result.powers).toEqual([]);
        });

        it("deve lançar erro quando não houver rodada ativa", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(null);

            await expect(
                service.findRound("ABC123")
            ).rejects.toThrow("Nenhuma rodada ativa encontrada");
        });

        it("deve preservar AppError lançado pelo serviço de sala", async () => {
            roomService.findRoom.mockRejectedValue(
                new AppError(404, "Sala não encontrada")
            );

            await expect(
                service.findRound("ABC123")
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            roomService.findRoom.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.findRound("ABC123")
            ).rejects.toThrow("Erro ao encontrar round");
        });
    });

    describe("roundFinished", () => {
        it("deve finalizar a rodada e criar a próxima", async () => {
            roomService.updateRoomPosition.mockResolvedValue({
                ...roomMock,
                position: 2
            });

            questionService.findQuestion.mockResolvedValue(questionMock);
            repo.updateRound.mockResolvedValue(undefined);
            repo.createRound.mockResolvedValue({});

            await expect(
                service.roundFinished("ABC123", 10)
            ).resolves.toBeUndefined();

            expect(roomService.updateRoomPosition).toHaveBeenCalledWith(
                "ABC123"
            );

            expect(questionService.findQuestion).toHaveBeenCalledWith(
                1,
                2
            );

            expect(repo.updateRound).toHaveBeenCalledWith(10);

            expect(repo.createRound).toHaveBeenCalledWith(1, 20);

            expect(socket.findQuestion).toHaveBeenCalledWith("ABC123");
        });

        it("deve preservar AppError ao atualizar a posição da sala", async () => {
            roomService.updateRoomPosition.mockRejectedValue(
                new AppError(404, "Sala não encontrada")
            );

            await expect(
                service.roundFinished("ABC123", 10)
            ).rejects.toThrow("Sala não encontrada");

            expect(repo.updateRound).not.toHaveBeenCalled();
            expect(repo.createRound).not.toHaveBeenCalled();
        });

        it("deve preservar AppError ao buscar a próxima pergunta", async () => {
            roomService.updateRoomPosition.mockResolvedValue({
                ...roomMock,
                position: 2
            });

            questionService.findQuestion.mockRejectedValue(
                new AppError(404, "Pergunta não encontrada")
            );

            await expect(
                service.roundFinished("ABC123", 10)
            ).rejects.toThrow("Pergunta não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            roomService.updateRoomPosition.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.roundFinished("ABC123", 10)
            ).rejects.toThrow("Erro ao terminar e criar round");
        });

        it("deve lançar erro 500 se a criação da próxima rodada falhar", async () => {
            roomService.updateRoomPosition.mockResolvedValue({
                ...roomMock,
                position: 2
            });

            questionService.findQuestion.mockResolvedValue(questionMock);
            repo.updateRound.mockResolvedValue(undefined);
            repo.createRound.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.roundFinished("ABC123", 10)
            ).rejects.toThrow("Erro ao terminar e criar round");
        });
    });

    describe("roundExpired", () => {
        it("deve emitir evento quando o tempo da rodada terminar", async () => {
            const now = 1_800_000_000_000;

            vi.spyOn(Date, "now").mockReturnValue(now);

            const expiredRound = {
                ...roundMock,
                opened_at: new Date(now - 11_000),
                closed_at: null
            } as unknown as RoundWithRelations;

            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(expiredRound);
            roomService.getAnswerStatistics.mockResolvedValue(
                statisticsMock
            );

            await expect(
                service.roundExpired("ABC123", 10)
            ).resolves.toBeUndefined();

            expect(roomService.getAnswerStatistics).toHaveBeenCalledWith(
                10,
                20
            );

            expect(socket.roundExpired).toHaveBeenCalledWith(
                "ABC123",
                statisticsMock
            );
        });

        it("não deve emitir evento se o tempo ainda não terminou", async () => {
            const now = 1_800_000_000_000;

            vi.spyOn(Date, "now").mockReturnValue(now);

            const activeRound = {
                ...roundMock,
                opened_at: new Date(now - 5_000),
                closed_at: null
            } as unknown as RoundWithRelations;

            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(activeRound);

            await expect(
                service.roundExpired("ABC123", 10)
            ).resolves.toBeUndefined();

            expect(roomService.getAnswerStatistics).not.toHaveBeenCalled();
            expect(socket.roundExpired).not.toHaveBeenCalled();
        });

        it("não deve fazer nada se a rodada já estiver fechada", async () => {
            const closedRound = {
                ...roundMock,
                closed_at: new Date()
            } as unknown as RoundWithRelations;

            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(closedRound);

            await expect(
                service.roundExpired("ABC123", 10)
            ).resolves.toBeUndefined();

            expect(roomService.getAnswerStatistics).not.toHaveBeenCalled();
            expect(socket.roundExpired).not.toHaveBeenCalled();
        });

        it("deve lançar erro quando a rodada não existir", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(null);

            await expect(
                service.roundExpired("ABC123", 10)
            ).rejects.toThrow("Rodada não encontrada");
        });

        it("deve lançar erro quando a data de abertura for inválida", async () => {
            const invalidRound = {
                ...roundMock,
                opened_at: new Date("invalid"),
                closed_at: null
            } as unknown as RoundWithRelations;

            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(invalidRound);

            await expect(
                service.roundExpired("ABC123", 10)
            ).rejects.toThrow("Data de abertura inválida");

            expect(roomService.getAnswerStatistics).not.toHaveBeenCalled();
        });

        it("deve preservar AppError ao buscar a sala", async () => {
            roomService.findRoom.mockRejectedValue(
                new AppError(404, "Sala não encontrada")
            );

            await expect(
                service.roundExpired("ABC123", 10)
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            roomService.findRoom.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.roundExpired("ABC123", 10)
            ).rejects.toThrow("Erro ao terminar round");
        });

        it("deve preservar AppError ao buscar estatísticas", async () => {
            const now = 1_800_000_000_000;

            vi.spyOn(Date, "now").mockReturnValue(now);

            const expiredRound = {
                ...roundMock,
                opened_at: new Date(now - 11_000),
                closed_at: null
            } as unknown as RoundWithRelations;

            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findById.mockResolvedValue(expiredRound);
            roomService.getAnswerStatistics.mockRejectedValue(
                new AppError(400, "Erro ao buscar estatísticas")
            );

            await expect(
                service.roundExpired("ABC123", 10)
            ).rejects.toThrow("Erro ao buscar estatísticas");
        });
    });
});
