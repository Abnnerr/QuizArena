
import { describe, it, expect, vi, beforeEach } from "vitest";
import { RoomService } from "../../../modules/room/room.service.js";
import type { RoomWithPlayers } from "../../../modules/room/dto/room.dto.js";
import type { RoomCreateDTO } from "../../../modules/room/schema/roomCreate.schema.js";
import type { IRoomRepository } from "../../../modules/room/contracts/room.repository.contract.js";
import type { IQuestionService } from "../../../modules/question/contracts/question.service.contract.js";
import type { IPowerService } from "../../../modules/powers/contracts/power.service.contract.js";
import type { SocketService } from "../../../shared/services/socket.service.js";
import type { IRoundRepository } from "../../../modules/round/contracts/round.repository.contract.js";
import type { PlayerService } from "../../../modules/players/player.service.js";
import { AppError } from "../../../error/AppError.js";
import type { Rooms } from "@prisma/client";


vi.mock("../../../observability/measure.js", () => ({
    measure: vi.fn(async (_name, callback) => callback())
}));

describe("RoomService", () => {
    let service: RoomService;

    const repo = {
        createRoom: vi.fn(),
        findByRoom: vi.fn(),
        joinRoom: vi.fn(),
        leaveRoom: vi.fn(),
        countQuestions: vi.fn(),
        roomUpdate: vi.fn(),
        findAlternative: vi.fn(),
        findAlternativeIncorret: vi.fn(),
        getAnswerStatistics: vi.fn(),
        limparRoom: vi.fn()
    };

    const serviceQuestion = {
        createQuestions: vi.fn(),
        findQuestion: vi.fn()
    };

    const servicePower = {
        createPowerPlayers: vi.fn()
    };

    const repoRound = {
        createRound: vi.fn(),
        findById: vi.fn(),
        updateRound: vi.fn()
    };

    const playerService = {
        countPlayers: vi.fn(),
        createPlayer: vi.fn(),
        findPlayerRoom: vi.fn(),
        deletePlayer: vi.fn()
    };

    const socket = {
        lobby: vi.fn(),
        leaveRoom: vi.fn(),
        roundStarted: vi.fn(),
        roomFinished: vi.fn()
    };

    const userMock = {
        id: "user-1",
        role: "USER",
        permissions: []
    };

    const roomMock = {
        room_id: 1,
        room_code: "ABC123",
        room_name: "Sala teste",
        host_user_id: "user-1",
        max_players: 10,
        room_status: "LOBBY",
        position: 0
    } as unknown as RoomWithPlayers;

    const roomCreatedMock = {
        ...roomMock,
        room_code: "XYZ123"
    } as Rooms;

    const roomCreateMock: RoomCreateDTO = {
        name: "Sala teste",
        maxPlayers: 10,
        timeLimit: 10,
        mode: "NORMAL",
        questions: [
            {
                text: "Pergunta 1",
                alternatives: [
                    { text: "A", isCorrect: true },
                    { text: "B", isCorrect: false }
                ]
            },
            {
                text: "Pergunta 2",
                alternatives: [
                    { text: "A", isCorrect: true },
                    { text: "B", isCorrect: false }
                ]
            },
            {
                text: "Pergunta 3",
                alternatives: [
                    { text: "A", isCorrect: true },
                    { text: "B", isCorrect: false }
                ]
            }
        ]
    };

    beforeEach(() => {
        vi.clearAllMocks();

        service = new RoomService(
            repo as unknown as IRoomRepository,
            serviceQuestion as unknown as IQuestionService,
            servicePower as unknown as IPowerService,
            repoRound as unknown as IRoundRepository,
            socket as unknown as SocketService
        );

        service.setPlayerService(
            playerService as unknown as PlayerService
        );
    });

    describe("createRoom", () => {
        it("deve criar uma sala com sucesso", async () => {
            repo.findByRoom.mockResolvedValue(null);
            serviceQuestion.createQuestions.mockResolvedValue([1, 2, 3]);
            repo.createRoom.mockResolvedValue(roomCreatedMock);

            const result = await service.createRoom(
                userMock,
                roomCreateMock
            );

            expect(result).toBe("XYZ123");
            expect(serviceQuestion.createQuestions).toHaveBeenCalledWith(
                roomCreateMock.questions
            );
            expect(repo.createRoom).toHaveBeenCalledWith(
                userMock.id,
                roomCreateMock,
                [1, 2, 3]
            );
        });

        it("não deve criar sala com nome já existente", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);

            await expect(
                service.createRoom(userMock, roomCreateMock)
            ).rejects.toThrow("Já existe uma sala com esse nome");

            expect(serviceQuestion.createQuestions).not.toHaveBeenCalled();
            expect(repo.createRoom).not.toHaveBeenCalled();
        });

        it("deve preservar AppError do serviço de perguntas", async () => {
            repo.findByRoom.mockResolvedValue(null);
            serviceQuestion.createQuestions.mockRejectedValue(
                new AppError(400, "Erro ao criar perguntas")
            );

            await expect(
                service.createRoom(userMock, roomCreateMock)
            ).rejects.toThrow("Erro ao criar perguntas");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.createRoom(userMock, roomCreateMock)
            ).rejects.toThrow("Erro ao criar sala");
        });
    });

    describe("findRoom", () => {
        it("deve encontrar uma sala", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);

            const result = await service.findRoom("ABC123");

            expect(result).toBe(roomMock);
            expect(repo.findByRoom).toHaveBeenCalledWith(
                undefined,
                "ABC123"
            );
        });

        it("deve lançar erro quando a sala não existir", async () => {
            repo.findByRoom.mockResolvedValue(null);

            await expect(
                service.findRoom("ABC123")
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.findRoom("ABC123")
            ).rejects.toThrow("Erro ao buscar sala");
        });
    });

    describe("joinRoom", () => {
        it("deve permitir a entrada de um jogador", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.findPlayerRoom.mockResolvedValue(null);
            playerService.countPlayers.mockResolvedValue(2);
            playerService.createPlayer.mockResolvedValue({
                player_id: "player-1",
                player_name: "Jonas"
            });
            repo.joinRoom.mockResolvedValue(undefined);

            const result = await service.joinRoom("ABC123", "Jonas");

            expect(result).toEqual({
                player_id: "player-1",
                player_name: "Jonas"
            });
            expect(repo.joinRoom).toHaveBeenCalledWith("player-1", 1);
            expect(socket.lobby).toHaveBeenCalledWith("ABC123");
        });

        it("deve rejeitar entrada em sala inexistente", async () => {
            repo.findByRoom.mockResolvedValue(null);

            await expect(
                service.joinRoom("ABC123", "Jonas")
            ).rejects.toThrow("Sala não encontrada");

            expect(playerService.createPlayer).not.toHaveBeenCalled();
        });

        it("deve rejeitar entrada em sala que não está no lobby", async () => {
            repo.findByRoom.mockResolvedValue({
                ...roomMock,
                room_status: "LIVE"
            });

            await expect(
                service.joinRoom("ABC123", "Jonas")
            ).rejects.toThrow("A sala não está aberta");
        });

        it("deve rejeitar entrada quando a sala estiver cheia", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.findPlayerRoom.mockResolvedValue(null);
            playerService.countPlayers.mockResolvedValue(10);

            await expect(
                service.joinRoom("ABC123", "Jonas")
            ).rejects.toThrow("Sala está cheia");

            expect(playerService.createPlayer).not.toHaveBeenCalled();
        });

        it("deve preservar AppError dos serviços", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.findPlayerRoom.mockResolvedValue(null);
            playerService.countPlayers.mockRejectedValue(
                new AppError(400, "Erro ao contar jogadores")
            );

            await expect(
                service.joinRoom("ABC123", "Jonas")
            ).rejects.toThrow("Erro ao contar jogadores");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.joinRoom("ABC123", "Jonas")
            ).rejects.toThrow("Erro ao entrar na sala");
        });
    });

    describe("leaveRoom", () => {
        it("deve remover o jogador da sala", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            repo.leaveRoom.mockResolvedValue(undefined);
            playerService.deletePlayer.mockResolvedValue(undefined);

            await expect(
                service.leaveRoom("player-1", "ABC123")
            ).resolves.toBeUndefined();

            expect(repo.leaveRoom).toHaveBeenCalledWith("player-1", 1);
            expect(playerService.deletePlayer).toHaveBeenCalledWith("player-1");
            expect(socket.leaveRoom).toHaveBeenCalledWith("ABC123");
        });

        it("deve rejeitar saída de sala inexistente", async () => {
            repo.findByRoom.mockResolvedValue(null);

            await expect(
                service.leaveRoom("player-1", "ABC123")
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.leaveRoom("player-1", "ABC123")
            ).rejects.toThrow("Erro ao sair da sala");
        });
    });

    describe("start", () => {
        it("deve iniciar a partida com sucesso", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.countPlayers.mockResolvedValue(2);
            serviceQuestion.findQuestion.mockResolvedValue({
                question_id: 10
            });
            servicePower.createPowerPlayers.mockResolvedValue(undefined);
            repoRound.createRound.mockResolvedValue({});
            repo.roomUpdate.mockResolvedValue({
                ...roomMock,
                room_status: "LIVE"
            });

            await expect(
                service.start(userMock, 1)
            ).resolves.toBeUndefined();

            expect(servicePower.createPowerPlayers).toHaveBeenCalledWith(1);
            expect(repoRound.createRound).toHaveBeenCalledWith(1, 10);
            expect(repo.roomUpdate).toHaveBeenCalledWith(1, "LIVE");
            expect(socket.roundStarted).toHaveBeenCalledWith("ABC123");
        });

        it("deve rejeitar início de sala inexistente", async () => {
            repo.findByRoom.mockResolvedValue(null);
            playerService.countPlayers.mockResolvedValue(2);

            await expect(
                service.start(userMock, 1)
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve rejeitar usuário que não é o host", async () => {
            repo.findByRoom.mockResolvedValue({
                ...roomMock,
                host_user_id: "outro-user"
            });
            playerService.countPlayers.mockResolvedValue(2);

            await expect(
                service.start(userMock, 1)
            ).rejects.toThrow("Você não é o host dessa sala");
        });

        it("deve rejeitar partida com menos de 2 jogadores", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.countPlayers.mockResolvedValue(1);

            await expect(
                service.start(userMock, 1)
            ).rejects.toThrow("Quantidade de jogadores necessária: 2");
        });

        it("deve preservar AppError ao buscar pergunta", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            playerService.countPlayers.mockResolvedValue(2);
            serviceQuestion.findQuestion.mockRejectedValue(
                new AppError(404, "Pergunta não encontrada")
            );

            await expect(
                service.start(userMock, 1)
            ).rejects.toThrow("Pergunta não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));
            playerService.countPlayers.mockResolvedValue(2);

            await expect(
                service.start(userMock, 1)
            ).rejects.toThrow("Erro ao iniciar partida");
        });
    });

    describe("updateRoomPosition", () => {
        it("deve atualizar a posição da sala", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            repo.roomUpdate.mockResolvedValue(roomCreatedMock);

            const result = await service.updateRoomPosition("ABC123");

            expect(result).toBe(roomCreatedMock);
            expect(repo.roomUpdate).toHaveBeenCalledWith(1);
        });

        it("deve rejeitar sala inexistente", async () => {
            repo.findByRoom.mockResolvedValue(null);

            await expect(
                service.updateRoomPosition("ABC123")
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.updateRoomPosition("ABC123")
            ).rejects.toThrow("Erro ao atualizar posição da sala");
        });
    });

    describe("findAlternatives", () => {
        it("deve encontrar uma alternativa", async () => {
            const alternative = {
                alternative_id: 1,
                is_correct: true
            };

            repo.findAlternative.mockResolvedValue(alternative);

            const result = await service.findAlternatives(10, 1);

            expect(result).toEqual(alternative);
            expect(repo.findAlternative).toHaveBeenCalledWith(10, 1);
        });

        it("deve retornar null quando não encontrar alternativa", async () => {
            repo.findAlternative.mockResolvedValue(null);

            const result = await service.findAlternatives(10, 1);

            expect(result).toBeNull();
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findAlternative.mockRejectedValue(new Error("Database error"));

            await expect(
                service.findAlternatives(10, 1)
            ).rejects.toThrow("Erro ao buscar alternativas");
        });
    });

    describe("getAnswerStatistics", () => {
        it("deve retornar estatísticas das respostas", async () => {
            const statistics = [
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

            repo.getAnswerStatistics.mockResolvedValue(statistics);

            const result = await service.getAnswerStatistics(1, 10);

            expect(result).toEqual(statistics);
            expect(repo.getAnswerStatistics).toHaveBeenCalledWith(1, 10);
        });

        it("deve retornar lista vazia quando não houver respostas", async () => {
            repo.getAnswerStatistics.mockResolvedValue([]);

            const result = await service.getAnswerStatistics(1, 10);

            expect(result).toEqual([]);
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.getAnswerStatistics.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.getAnswerStatistics(1, 10)
            ).rejects.toThrow("Erro ao buscar estatísticas das respostas");
        });
    });

    describe("findAlternativesIncorret", () => {
        it("deve retornar alternativas incorretas", async () => {
            const alternatives = [
                { alternative_id: 2 },
                { alternative_id: 3 }
            ];

            repo.findAlternativeIncorret.mockResolvedValue(alternatives);

            const result = await service.findAlternativesIncorret(10);

            expect(result).toEqual(alternatives);
        });

        it("deve lançar erro quando não houver alternativas", async () => {
            repo.findAlternativeIncorret.mockResolvedValue([]);

            await expect(
                service.findAlternativesIncorret(10)
            ).rejects.toThrow("Alternativas não encontradas");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findAlternativeIncorret.mockRejectedValue(
                new Error("Database error")
            );

            await expect(
                service.findAlternativesIncorret(10)
            ).rejects.toThrow("Erro ao buscar alternativas incorretas");
        });
    });

    describe("limparRoom", () => {
        it("deve limpar a sala com sucesso", async () => {
            repo.findByRoom.mockResolvedValue(roomMock);
            repo.limparRoom.mockResolvedValue(undefined);

            await expect(
                service.limparRoom("ABC123", 1)
            ).resolves.toBeUndefined();

            expect(repo.limparRoom).toHaveBeenCalledWith(1);
            expect(socket.roomFinished).toHaveBeenCalledWith("ABC123");
        });

        it("deve rejeitar limpeza de sala inexistente", async () => {
            repo.findByRoom.mockResolvedValue(null);

            await expect(
                service.limparRoom("ABC123", 1)
            ).rejects.toThrow("Sala não encontrada");
        });

        it("deve lançar erro 500 em falha inesperada", async () => {
            repo.findByRoom.mockRejectedValue(new Error("Database error"));

            await expect(
                service.limparRoom("ABC123", 1)
            ).rejects.toThrow("Erro ao limpar sala");
        });
    });
});
