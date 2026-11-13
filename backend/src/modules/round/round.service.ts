import { time } from "node:console";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { PowerRepository } from "../powers/powers.repository.js";
import type { QuestionService } from "../question/question.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { RoundRepository } from "./round.repository.js";

export class RoundService {
    constructor(
        private readonly repo: RoundRepository,
        private readonly roomService: IRoomService,
        private readonly questionService: QuestionService,
        private readonly repoPower: PowerRepository,
        private readonly socket: SocketService,
    ) {

    }

    async findRound(roomCode: string, playerId?: string): Promise<any> {
        try {
            const room = await this.roomService.findRoom(roomCode);
            const round = await this.repo.findById(
                room.room_id,
                undefined,
                playerId
            );
            if (!round) {
                throw new AppError(404, "Nenhuma rodada ativa encontrada");
            }
            let skip = false;
            let fiftyAlternatives = []

            if (playerId) {
                const [power, fifty] = await Promise.all([
                    this.repoPower.findPowerTarget(
                        playerId,
                        room.room_id,
                        round.round_id,
                        "SKIP_TURN"
                    ),
                    this.repoPower.findPowerPlayer(
                        playerId,
                        room.room_id,
                        "FIFTY_FIFTY"
                    )
                ]);

                if (fifty?.used) {
                    fiftyAlternatives = await this.roomService.findAlternativesIncorret(round.question_id)
                }
                skip = power ? true : false;
            }
            return {
                round_id: round.round_id,
                round_opened: round.opened_at,
                server_now: new Date(),
                question_id: round.questions.question_id,
                question_text: round.questions.question_text,
                alternatives: round.questions.alternatives,
                time_limit: round.rooms.time_limit,
                count_questions: round.rooms._count.roomQuestions,
                position: round.rooms.position,

                ...(playerId && {
                    powers: round.rooms.roomPlayers
                        .find(player => player.player_id === playerId)
                        ?.powerUpUses.map(use => ({
                            powerup_id: use.powerup.powerup_id,
                            powerup_type: use.powerup.powerup_type,
                            descricao: use.powerup.descricao,
                            used: use.used
                        })) ?? []
                }),
                fiftyAlternatives,
                skip
            };

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            console.error(error);
            throw new AppError(500, "Erro ao encontrar round");
        }
    }
    async roundFinished(roomCode: string, round_id: number) {
        try {
            await this.repo.updateRound(round_id)

            const room = await this.roomService.updateRoomPosition(roomCode)
            const question = await this.questionService.findQuestion(room?.room_id!, room.position)

            await this.repo.createRound(room?.room_id!, question.question_id)

            console.log("6. Evento enviado para:", room.room_code);

            this.socket.findQuestion(room?.room_code!)
        } catch (error) {
            console.error('erro ao terminar round', error);
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao terminar e criar round')
        }
    }

}