
import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";

import { AppError } from "../../../error/AppError.js";
import { PlayerService } from "../../../modules/players/player.service.js";

vi.mock("../../../observability/measure.js", () => ({
    measure: vi.fn(
        async (_name: string, callback: () => Promise<unknown>) => callback()
    )
}));

describe("PlayerService", () => {
    let service: PlayerService;

    let repo: {
        countPlayers: ReturnType<typeof vi.fn>;
        findPlayer: ReturnType<typeof vi.fn>;
        create: ReturnType<typeof vi.fn>;
        findPlayerRoom: ReturnType<typeof vi.fn>;
        readyPlayer: ReturnType<typeof vi.fn>;
        playerScore: ReturnType<typeof vi.fn>;
        updatePlayerScore: ReturnType<typeof vi.fn>;
        deletePlayer: ReturnType<typeof vi.fn>;
        findPlayers: ReturnType<typeof vi.fn>;
    };

    let repoPower: {
        findPowerById: ReturnType<typeof vi.fn>;
    };

    let repoRound: {
        findById: ReturnType<typeof vi.fn>;
    };

    let socket: {
        playerReady: ReturnType<typeof vi.fn>;
    };

    let roomService: {
        findRoom: ReturnType<typeof vi.fn>;
    };

    const playerMock = {
        player_id: "player-123",
        player_name: "Jonas"
    };

    const roomMock = {
        room_id: 1,
        room_code: "ABC123",
        position: 0
    };

    const roomPlayerMock = {
        player_id: "player-123",
        room_id: 1,
        ready: true,
        score: 100
    };

    beforeEach(() => {
        vi.clearAllMocks();

        repo = {
            countPlayers: vi.fn(),
            findPlayer: vi.fn(),
            create: vi.fn(),
            findPlayerRoom: vi.fn(),
            readyPlayer: vi.fn(),
            playerScore: vi.fn(),
            updatePlayerScore: vi.fn(),
            deletePlayer: vi.fn(),
            findPlayers: vi.fn()
        };

        repoPower = {
            findPowerById: vi.fn()
        };

        repoRound = {
            findById: vi.fn()
        };

        socket = {
            playerReady: vi.fn()
        };

        roomService = {
            findRoom: vi.fn()
        };

        service = new PlayerService(
            repo as never,
            repoPower as never,
            repoRound as never,
            socket as never
        );

        service.setRoomService(roomService as never);
    });


    describe("countPlayers", () => {
        it("deve retornar a quantidade de jogadores", async () => {
            repo.countPlayers.mockResolvedValue(5);

            const result = await service.countPlayers(1);

            expect(result).toBe(5);
            expect(repo.countPlayers).toHaveBeenCalledWith(1);
        });

        it("deve lançar AppError quando o repository falhar", async () => {
            repo.countPlayers.mockRejectedValue(new Error("Erro no banco"));

            await expect(service.countPlayers(1))
                .rejects.toThrow("Erro ao contar players");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(404, "Sala não encontrada");

            repo.countPlayers.mockRejectedValue(error);

            await expect(service.countPlayers(1))
                .rejects.toBe(error);
        });
    });

    describe("createPlayer", () => {
        it("deve criar um jogador com sucesso", async () => {
            repo.findPlayer.mockResolvedValue(null);
            repo.create.mockResolvedValue(playerMock);

            const result = await service.createPlayer("Jonas");

            expect(result).toEqual(playerMock);

            expect(repo.findPlayer).toHaveBeenCalledWith("Jonas");
            expect(repo.create).toHaveBeenCalledWith("Jonas");
        });

        it("não deve criar jogador com nome já utilizado", async () => {
            repo.findPlayer.mockResolvedValue(playerMock);

            await expect(service.createPlayer("Jonas"))
                .rejects.toThrow("Esse nome já está em uso");

            expect(repo.create).not.toHaveBeenCalled();
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.findPlayer.mockRejectedValue(new Error("Erro no banco"));

            await expect(service.createPlayer("Jonas"))
                .rejects.toThrow("Erro ao criar player");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(400, "Erro de validação");

            repo.findPlayer.mockRejectedValue(error);

            await expect(service.createPlayer("Jonas"))
                .rejects.toBe(error);
        });
    });

    describe("findPlayerRoom", () => {
        it("deve retornar null quando o jogador não estiver na sala", async () => {
            repo.findPlayerRoom.mockResolvedValue(null);

            const result = await service.findPlayerRoom("Jonas", 1);

            expect(result).toBeNull();

            expect(repo.findPlayerRoom)
                .toHaveBeenCalledWith("Jonas", 1);
        });

        it("deve lançar erro quando o jogador já estiver na sala", async () => {
            repo.findPlayerRoom.mockResolvedValue(roomPlayerMock);

            await expect(service.findPlayerRoom("Jonas", 1))
                .rejects.toThrow("Player já está na sala");
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.findPlayerRoom.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(service.findPlayerRoom("Jonas", 1))
                .rejects.toThrow("Erro ao verificar player na sala");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(404, "Jogador não encontrado");

            repo.findPlayerRoom.mockRejectedValue(error);

            await expect(service.findPlayerRoom("Jonas", 1))
                .rejects.toBe(error);
        });
    });


    describe("readyPlayer", () => {
        it("deve atualizar o status do jogador e emitir evento pelo socket", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.readyPlayer.mockResolvedValue(roomPlayerMock);

            await expect(
                service.readyPlayer("player-123", "ABC123", true)
            ).resolves.toBeUndefined();

            expect(roomService.findRoom)
                .toHaveBeenCalledWith("ABC123");

            expect(repo.readyPlayer).toHaveBeenCalledWith(
                "player-123",
                1,
                true
            );

            expect(socket.playerReady).toHaveBeenCalledWith(
                "ABC123",
                "player-123",
                true
            );
        });

        it("deve emitir o status false quando o jogador não estiver pronto", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            repo.readyPlayer.mockResolvedValue({
                ...roomPlayerMock,
                ready: false
            });

            await service.readyPlayer("player-123", "ABC123", false);

            expect(socket.playerReady).toHaveBeenCalledWith(
                "ABC123",
                "player-123",
                false
            );
        });

        it("deve lançar erro quando o repository não retornar jogador", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            repo.readyPlayer.mockResolvedValue(null as never);

            await expect(
                service.readyPlayer("player-123", "ABC123", true)
            ).rejects.toThrow("Erro ao player ficar pronto");

            expect(socket.playerReady).not.toHaveBeenCalled();
        });

        it("deve lançar erro 500 quando ocorrer uma falha inesperada", async () => {
            roomService.findRoom.mockRejectedValue(
                new Error("Erro ao buscar sala")
            );

            await expect(
                service.readyPlayer("player-123", "ABC123", true)
            ).rejects.toThrow("Erro ao atualizar status do player");
        });
    });

    describe("updatePlayerScore", () => {
        it("deve atualizar a pontuação somando os pontos anteriores", async () => {
            repo.playerScore.mockResolvedValue({
                score: 100
            });

            repo.updatePlayerScore.mockResolvedValue(undefined);

            await expect(
                service.updatePlayerScore(1, "player-123", 50)
            ).resolves.toBeUndefined();

            expect(repo.playerScore)
                .toHaveBeenCalledWith(1, "player-123");

            expect(repo.updatePlayerScore).toHaveBeenCalledWith(
                1,
                "player-123",
                150
            );
        });

        it("deve considerar zero quando o jogador não possuir pontuação", async () => {
            repo.playerScore.mockResolvedValue(null);

            await service.updatePlayerScore(1, "player-123", 50);

            expect(repo.updatePlayerScore).toHaveBeenCalledWith(
                1,
                "player-123",
                50
            );
        });

        it("deve permitir pontuação negativa quando o total continuar positivo", async () => {
            repo.playerScore.mockResolvedValue({
                score: 100
            });

            await service.updatePlayerScore(1, "player-123", -30);

            expect(repo.updatePlayerScore).toHaveBeenCalledWith(
                1,
                "player-123",
                70
            );
        });

        it("não deve permitir que a pontuação total fique negativa", async () => {
            repo.playerScore.mockResolvedValue({
                score: 100
            });

            await expect(
                service.updatePlayerScore(1, "player-123", -200)
            ).rejects.toThrow("Score negativo");

            expect(repo.updatePlayerScore).not.toHaveBeenCalled();
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.playerScore.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(
                service.updatePlayerScore(1, "player-123", 50)
            ).rejects.toThrow("Erro ao atualizar pontuação do player");
        });
    });

    describe("deletePlayer", () => {
        it("deve excluir um jogador com sucesso", async () => {
            repo.deletePlayer.mockResolvedValue(undefined);

            await expect(
                service.deletePlayer("player-123")
            ).resolves.toBeUndefined();

            expect(repo.deletePlayer)
                .toHaveBeenCalledWith("player-123");
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.deletePlayer.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(
                service.deletePlayer("player-123")
            ).rejects.toThrow("Erro ao excluir player");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(404, "Jogador não encontrado");

            repo.deletePlayer.mockRejectedValue(error);

            await expect(service.deletePlayer("player-123"))
                .rejects.toBe(error);
        });
    });

    describe("findPodium", () => {
        const podiumMock = [
            {
                player_id: "player-123",
                room_id: 1,
                ready: true,
                score: 100,
                players: {
                    player_id: "player-123",
                    player_name: "Jonas"
                }
            }
        ];

        it("deve retornar o pódio da sala", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findPlayers.mockResolvedValue(podiumMock);

            const result = await service.findPodium("ABC123");

            expect(result).toEqual(podiumMock);

            expect(roomService.findRoom)
                .toHaveBeenCalledWith("ABC123");

            expect(repo.findPlayers).toHaveBeenCalledWith(1);
        });

        it("deve retornar uma lista vazia quando não houver jogadores", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);
            repo.findPlayers.mockResolvedValue([]);

            const result = await service.findPodium("ABC123");

            expect(result).toEqual([]);
        });

        it("deve lançar erro 500 quando ocorrer uma falha inesperada", async () => {
            roomService.findRoom.mockRejectedValue(
                new Error("Erro ao buscar sala")
            );

            await expect(service.findPodium("ABC123"))
                .rejects.toThrow("Erro ao buscar pódio");
        });

        it("deve preservar AppError lançado pelo RoomService", async () => {
            const error = new AppError(404, "Sala não encontrada");

            roomService.findRoom.mockRejectedValue(error);

            await expect(service.findPodium("ABC123"))
                .rejects.toBe(error);
        });
    });


    describe("powerUp", () => {
        it("deve lançar erro 404 quando o power-up não existir", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            repoPower.findPowerById.mockResolvedValue(null);
            repoRound.findById.mockResolvedValue({
                round_id: 10,
                question_id: 20
            });

            await expect(
                service.powerUp("ABC123", "player-123", 1)
            ).rejects.toThrow("PowerUp não encontrado");

            expect(repoPower.findPowerById).toHaveBeenCalledWith(1);
            expect(repoRound.findById).toHaveBeenCalledWith(1);
        });

        it("deve lançar erro 404 quando a rodada não existir", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            repoPower.findPowerById.mockResolvedValue({
                powerup_id: 1,
                powerup_type: "SKIP_TURN"
            });

            repoRound.findById.mockResolvedValue(null);

            await expect(
                service.powerUp("ABC123", "player-123", 1)
            ).rejects.toThrow("Rodada não encontrada");
        });

        it("deve preservar o erro quando a Factory não encontrar uma estratégia válida", async () => {
            roomService.findRoom.mockResolvedValue(roomMock);

            repoPower.findPowerById.mockResolvedValue({
                powerup_id: 1,
                powerup_type: "INVALID_POWER_TYPE"
            });

            repoRound.findById.mockResolvedValue({
                round_id: 10,
                question_id: 20
            });

            await expect(
                service.powerUp("ABC123", "player-123", 1)
            ).rejects.toThrow("PowerUp invalido");
        });

        it("deve preservar AppError lançado pelo RoomService", async () => {
            const error = new AppError(404, "Sala não encontrada");

            roomService.findRoom.mockRejectedValue(error);

            await expect(
                service.powerUp("ABC123", "player-123", 1)
            ).rejects.toBe(error);
        });
    });
});
