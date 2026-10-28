import { AppError } from "../../error/AppError.js";
export class RoundService {
    repo;
    roomService;
    questionService;
    socket;
    constructor(repo, roomService, questionService, socket) {
        this.repo = repo;
        this.roomService = roomService;
        this.questionService = questionService;
        this.socket = socket;
    }
    async findRound(roomCode) {
        try {
            const room = await this.roomService.findRoom(roomCode);
            const round = await this.repo.findById(room?.room_id);
            return {
                round_id: round?.round_id,
                round_opened: round?.opened_at,
                question_id: round?.questions.question_id,
                question_text: round?.questions.question_text,
                alternatives: round?.questions.alternatives,
                time_limit: round?.rooms.time_limit,
                count_questions: round?.rooms._count.roomQuestions,
                position: round?.rooms.position
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao encontrar round');
        }
    }
    async roundFinished(roomCode, round_id) {
        try {
            await this.repo.updateRound(round_id);
            const room = await this.roomService.updateRoomPosition(roomCode);
            const question = await this.questionService.findQuestion(room?.room_id, room.position);
            await this.repo.createRound(room?.room_id, question.question_id);
            console.log("6. Evento enviado para:", room.room_code);
            this.socket.findQuestion(room?.room_code);
        }
        catch (error) {
            console.error('erro ao terminar round', error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao terminar e criar round');
        }
    }
}
//# sourceMappingURL=round.service.js.map