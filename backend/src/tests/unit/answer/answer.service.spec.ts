
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AnswerService } from "../../../modules/answers/answer.service.js";
import type { IAnswerRepository } from "../../../modules/answers/contracts/answer.repository.contract.js";
import type { IRoomService } from "../../../modules/room/contracts/room.service.contract.js";
import type { IRoundService } from "../../../modules/round/contracts/round.service.contract.js";
import type { IPowerService } from "../../../modules/powers/contracts/power.service.contract.js";
import type { IPlayerService } from "../../../modules/players/contracts/player.service.contract.js";

describe("AnswerService", () => {
    let service: AnswerService;

    let repo: {
        createAnswer: ReturnType<typeof vi.fn>;
    };

    let roomService: {
        findRoom: ReturnType<typeof vi.fn>;
        findAlternatives: ReturnType<typeof vi.fn>;
    };

    let roundService: {
        findRound: ReturnType<typeof vi.fn>;
    };

    let powerService: {
        findPowerPlayer: ReturnType<typeof vi.fn>;
        findPowerTarget: ReturnType<typeof vi.fn>;
    };

    let playerService: {
        updatePlayerScore: ReturnType<typeof vi.fn>;
    };

    const room = {
        room_id: 1,
        room_code: "ABC123",
        time_limit: 30,
        room_mode: "NORMAL",
        position: 1
    };

    const round = {
        round_id: 10,
        question_id: 20,
        round_opened: new Date("2026-11-14T12:00:00.000Z"),
        answers: []
    };

    const playerId = "player-123";
    const roomCode = "ABC123";
    const roundId = 10;
    const alternativeId = 5;

    const correctAlternative = {
        alternative_id: alternativeId,
        is_correct: true
    };

    beforeEach(() => {
        vi.spyOn(Date, "now").mockReturnValue(
            new Date("2026-11-14T12:00:00.000Z").getTime()
        );

        repo = {
            createAnswer: vi.fn().mockResolvedValue(undefined)
        };

        roomService = {
            findRoom: vi.fn().mockResolvedValue(room),
            findAlternatives: vi.fn().mockResolvedValue(correctAlternative)
        };

        roundService = {
            findRound: vi.fn().mockResolvedValue(round)
        };

        powerService = {
            findPowerPlayer: vi.fn().mockResolvedValue(null),
            findPowerTarget: vi.fn().mockResolvedValue(null)
        };

        playerService = {
            updatePlayerScore: vi.fn().mockResolvedValue(undefined)
        };

        service = new AnswerService(
            repo as unknown as IAnswerRepository,
            roomService as unknown as IRoomService,
            roundService as unknown as IRoundService,
            powerService as unknown as IPowerService,
            playerService as unknown as IPlayerService
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("createAnswer", () => {
        it("deve criar uma resposta correta e atualizar a pontuação", async () => {
            const result = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(result.isCorrect).toBe(true);
            expect(result.scores).toBeGreaterThan(0);

            expect(repo.createAnswer).toHaveBeenCalledWith(
                roundId,
                playerId,
                alternativeId,
                result.scores
            );

            expect(playerService.updatePlayerScore).toHaveBeenCalledWith(
                room.room_id,
                playerId,
                result.scores
            );
        });

        it("deve atribuir zero pontos quando a resposta estiver incorreta no modo NORMAL", async () => {
            roomService.findAlternatives.mockResolvedValue({
                alternative_id: alternativeId,
                is_correct: false
            });

            const result = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(result).toEqual({
                scores: 0,
                isCorrect: false
            });

            expect(repo.createAnswer).toHaveBeenCalledWith(
                roundId,
                playerId,
                alternativeId,
                0
            );

            expect(playerService.updatePlayerScore).toHaveBeenCalledWith(
                room.room_id,
                playerId,
                0
            );
        });

        it("deve retirar 30 pontos quando a resposta estiver incorreta no modo HARDCORE", async () => {
            roomService.findRoom.mockResolvedValue({
                ...room,
                room_mode: "HARDCORE"
            });

            roomService.findAlternatives.mockResolvedValue({
                alternative_id: alternativeId,
                is_correct: false
            });

            const result = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(result).toEqual({
                scores: -30,
                isCorrect: false
            });

            expect(repo.createAnswer).toHaveBeenCalledWith(
                roundId,
                playerId,
                alternativeId,
                -30
            );

            expect(playerService.updatePlayerScore).toHaveBeenCalledWith(
                room.room_id,
                playerId,
                -30
            );
        });

        it("deve dobrar a pontuação quando DOUBLE_XP estiver ativo na posição atual", async () => {
            const baseline = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            repo.createAnswer.mockClear();
            playerService.updatePlayerScore.mockClear();

            powerService.findPowerPlayer.mockResolvedValue({
                position: room.position,
                used: true
            });

            const result = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(result.scores).toBe(baseline.scores * 2);

            expect(repo.createAnswer).toHaveBeenCalledWith(
                roundId,
                playerId,
                alternativeId,
                result.scores
            );

            expect(playerService.updatePlayerScore).toHaveBeenCalledWith(
                room.room_id,
                playerId,
                result.scores
            );
        });

        it("não deve dobrar a pontuação quando DOUBLE_XP pertencer a outra posição", async () => {
            const baseline = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            repo.createAnswer.mockClear();

            powerService.findPowerPlayer.mockResolvedValue({
                position: room.position + 1,
                used: true
            });

            const result = await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(result.scores).toBe(baseline.scores);
        });

        it("deve lançar erro 400 quando o jogador tiver pulado a rodada", async () => {
            powerService.findPowerTarget.mockResolvedValue({
                position: room.position,
                used: true
            });

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 400,
                message: "Você pulou esta rodada"
            });

            expect(repo.createAnswer).not.toHaveBeenCalled();
            expect(playerService.updatePlayerScore).not.toHaveBeenCalled();
        });

        it("deve lançar erro 404 quando a alternativa não existir", async () => {
            roomService.findAlternatives.mockResolvedValue(null);

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 404,
                message: "Alternativa não encontrada"
            });

            expect(repo.createAnswer).not.toHaveBeenCalled();
            expect(playerService.updatePlayerScore).not.toHaveBeenCalled();
        });

        it("deve lançar erro 409 quando o jogador já tiver respondido", async () => {
            roundService.findRound.mockResolvedValue({
                ...round,
                answers: [
                    {
                        player_id: playerId
                    }
                ]
            });

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 409,
                message: "Você já respondeu a esta rodada"
            });

            expect(powerService.findPowerPlayer).not.toHaveBeenCalled();
            expect(powerService.findPowerTarget).not.toHaveBeenCalled();
            expect(roomService.findAlternatives).not.toHaveBeenCalled();
            expect(repo.createAnswer).not.toHaveBeenCalled();
        });

        it("deve lançar erro 409 quando a rodada informada não for a rodada ativa", async () => {
            roundService.findRound.mockResolvedValue({
                ...round,
                round_id: 99
            });

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 409,
                message: "Esta rodada não está mais ativa"
            });

            expect(repo.createAnswer).not.toHaveBeenCalled();
        });

        it("deve lançar erro 500 quando ocorrer uma falha inesperada", async () => {
            roomService.findRoom.mockRejectedValue(
                new Error("Database connection failed")
            );

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 500,
                message: "Erro ao criar resposta"
            });
        });

        it("deve lançar erro 500 quando falhar ao salvar a resposta", async () => {
            repo.createAnswer.mockRejectedValue(
                new Error("Failed to create answer")
            );

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 500,
                message: "Erro ao criar resposta"
            });
        });

        it("deve lançar erro 500 quando falhar ao atualizar a pontuação do jogador", async () => {
            playerService.updatePlayerScore.mockRejectedValue(
                new Error("Failed to update player score")
            );

            await expect(
                service.createAnswer(
                    roomCode,
                    roundId,
                    playerId,
                    alternativeId
                )
            ).rejects.toMatchObject({
                status: 500,
                message: "Erro ao criar resposta"
            });
        });

        it("deve buscar os poderes e a alternativa com os parâmetros corretos", async () => {
            await service.createAnswer(
                roomCode,
                roundId,
                playerId,
                alternativeId
            );

            expect(roomService.findRoom).toHaveBeenCalledWith(roomCode);

            expect(roundService.findRound).toHaveBeenCalledWith(
                room.room_code
            );

            expect(powerService.findPowerPlayer).toHaveBeenCalledWith(
                playerId,
                room.room_id,
                "DOUBLE_XP"
            );

            expect(powerService.findPowerTarget).toHaveBeenCalledWith(
                playerId,
                room.room_id,
                round.round_id,
                "SKIP_TURN"
            );

            expect(roomService.findAlternatives).toHaveBeenCalledWith(
                round.question_id,
                alternativeId
            );
        });
    });
});
