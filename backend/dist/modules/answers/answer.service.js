import { AppError } from "../../error/AppError.js";
export class AnswerService {
    repo;
    roomService;
    roundService;
    playerService;
    constructor(repo, roomService, roundService, playerService) {
        this.repo = repo;
        this.roomService = roomService;
        this.roundService = roundService;
        this.playerService = playerService;
    }
    async createAnswer(roomCode, roundId, playerId, alternativeId) {
        try {
            console.log(roomCode, roundId, playerId, alternativeId);
            const room = await this.roomService.findRoom(roomCode);
            if (!room) {
                throw new Error("Sala não encontrada");
            }
            const round = await this.roundService.findRound(room.room_code);
            if (!round) {
                throw new Error("Rodada não encontrada");
            }
            const alternative = await this.roomService.findAlternatives(round.question_id, alternativeId);
            console.log("alternativas:", alternative);
            if (!alternative) {
                throw new Error("Alternativa não encontrada");
            }
            let scores = 0;
            if (alternative.is_correct) {
                const answeredAt = new Date();
                const elapsedSeconds = (answeredAt.getTime() - new Date(round.round_opened).getTime()) / 1000;
                const timeLimit = room.time_limit;
                const remainingSeconds = Math.max(0, Math.min(timeLimit, timeLimit - elapsedSeconds));
                if (room.room_mode === "NORMAL") {
                    scores = Math.ceil(900 * remainingSeconds / timeLimit);
                }
                else if (room.room_mode === "HARDCORE") {
                    scores = Math.ceil(500 * remainingSeconds / timeLimit);
                }
            }
            await this.repo.createAnswer(roundId, playerId, alternativeId, scores);
            await this.playerService.updatePlayerScore(room.room_id, playerId, scores);
            return {
                scores,
                isCorrect: alternative.is_correct,
            };
        }
        catch (error) {
            console.error('Erro ao criar resposta:', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar resposta');
        }
    }
}
//# sourceMappingURL=answer.service.js.map