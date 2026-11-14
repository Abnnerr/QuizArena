
import {
    beforeEach,
    describe,
    expect,
    it,
    vi
} from "vitest";
import { PowerService } from "../../../modules/powers/powers.service.js";
import type { IPowerRepository } from "../../../modules/powers/contracts/power.repository.contract.js";
import type { IPlayerRepository } from "../../../modules/players/contracts/player.respository.contract.js";
import { AppError } from "../../../error/AppError.js";



vi.mock("../../../observability/measure.js", () => ({
    measure: vi.fn(
        async (_name: string, callback: () => Promise<unknown>) => callback()
    )
}));

describe("PowerService", () => {
    let service: PowerService;

    let repo: {
        powerPlayers: ReturnType<typeof vi.fn>;
        findPowerPlayer: ReturnType<typeof vi.fn>;
        findPowerTarget: ReturnType<typeof vi.fn>;
    };

    let repoPlayer: {
        findPlayers: ReturnType<typeof vi.fn>;
    };

    const playersMock = [
        {
            player_id: "player-1",
            room_id: 1,
            score: 100,
            ready: true,
            players: {
                player_id: "player-1",
                player_name: "Jonas"
            }
        },
        {
            player_id: "player-2",
            room_id: 1,
            score: 200,
            ready: true,
            players: {
                player_id: "player-2",
                player_name: "Maria"
            }
        }
    ];

    const powerMock = {
        powerup_use_id: 1,
        player_id: "player-1",
        room_id: 1,
        powerup_id: 1
    };

    beforeEach(() => {
        vi.clearAllMocks();

        repo = {
            powerPlayers: vi.fn(),
            findPowerPlayer: vi.fn(),
            findPowerTarget: vi.fn()
        };

        repoPlayer = {
            findPlayers: vi.fn()
        };

        service = new PowerService(
            repo as unknown as IPowerRepository,
            repoPlayer as unknown as IPlayerRepository
        );
    });

    describe("createPowerPlayers", () => {
        it("deve criar os powers para todos os jogadores da sala", async () => {
            repoPlayer.findPlayers.mockResolvedValue(playersMock);
            repo.powerPlayers.mockResolvedValue(undefined);

            await expect(
                service.createPowerPlayers(1)
            ).resolves.toBeUndefined();

            expect(repoPlayer.findPlayers).toHaveBeenCalledWith(1);

            expect(repo.powerPlayers).toHaveBeenCalledWith(
                ["player-1", "player-2"],
                1
            );
        });

        it("deve chamar o repository com uma lista vazia quando não houver jogadores", async () => {
            repoPlayer.findPlayers.mockResolvedValue([]);
            repo.powerPlayers.mockResolvedValue(undefined);

            await service.createPowerPlayers(1);

            expect(repo.powerPlayers).toHaveBeenCalledWith([], 1);
        });

        it("deve lançar erro 500 quando o repository de jogadores falhar", async () => {
            repoPlayer.findPlayers.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(
                service.createPowerPlayers(1)
            ).rejects.toThrow("Erro ao criar powers");

            expect(repo.powerPlayers).not.toHaveBeenCalled();
        });

        it("deve lançar erro 500 quando a criação dos powers falhar", async () => {
            repoPlayer.findPlayers.mockResolvedValue(playersMock);

            repo.powerPlayers.mockRejectedValue(
                new Error("Erro ao criar powers no banco")
            );

            await expect(
                service.createPowerPlayers(1)
            ).rejects.toThrow("Erro ao criar powers");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(400, "Erro de negócio");

            repoPlayer.findPlayers.mockRejectedValue(error);

            await expect(
                service.createPowerPlayers(1)
            ).rejects.toBe(error);
        });
    });


    describe("findPowerPlayer", () => {
        it("deve retornar o power do jogador", async () => {
            repo.findPowerPlayer.mockResolvedValue(powerMock);

            const result = await service.findPowerPlayer(
                "player-1",
                1
            );

            expect(result).toEqual(powerMock);

            expect(repo.findPowerPlayer).toHaveBeenCalledWith(
                "player-1",
                1,
                undefined
            );
        });

        it("deve filtrar pelo tipo de power quando informado", async () => {
            repo.findPowerPlayer.mockResolvedValue(powerMock);

            const result = await service.findPowerPlayer(
                "player-1",
                1,
                "SKIP_TURN"
            );

            expect(result).toEqual(powerMock);

            expect(repo.findPowerPlayer).toHaveBeenCalledWith(
                "player-1",
                1,
                "SKIP_TURN"
            );
        });

        it("deve retornar null quando o jogador não possuir o power", async () => {
            repo.findPowerPlayer.mockResolvedValue(null);

            const result = await service.findPowerPlayer(
                "player-1",
                1
            );

            expect(result).toBeNull();
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.findPowerPlayer.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(
                service.findPowerPlayer("player-1", 1)
            ).rejects.toThrow("Erro ao encontrar o power");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(404, "Power não encontrado");

            repo.findPowerPlayer.mockRejectedValue(error);

            await expect(
                service.findPowerPlayer("player-1", 1)
            ).rejects.toBe(error);
        });
    });

    describe("findPowerTarget", () => {
        it("deve retornar o power utilizado pelo alvo", async () => {
            repo.findPowerTarget.mockResolvedValue(powerMock);

            const result = await service.findPowerTarget(
                "player-1",
                1,
                10,
                "SKIP_TURN"
            );

            expect(result).toEqual(powerMock);

            expect(repo.findPowerTarget).toHaveBeenCalledWith(
                "player-1",
                1,
                10,
                "SKIP_TURN"
            );
        });

        it("deve retornar null quando o alvo não possuir o power", async () => {
            repo.findPowerTarget.mockResolvedValue(null);

            const result = await service.findPowerTarget(
                "player-1",
                1,
                10,
                "SKIP_TURN"
            );

            expect(result).toBeNull();
        });

        it("deve lançar erro 500 quando o repository falhar", async () => {
            repo.findPowerTarget.mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(
                service.findPowerTarget(
                    "player-1",
                    1,
                    10,
                    "SKIP_TURN"
                )
            ).rejects.toThrow("Erro ao encontrar o power");
        });

        it("deve preservar AppError lançado pelo repository", async () => {
            const error = new AppError(404, "Power do alvo não encontrado");

            repo.findPowerTarget.mockRejectedValue(error);

            await expect(
                service.findPowerTarget(
                    "player-1",
                    1,
                    10,
                    "SKIP_TURN"
                )
            ).rejects.toBe(error);
        });
    });
});
