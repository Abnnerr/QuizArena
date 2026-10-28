import type { RoundWithQuestion } from "./dto/round.dto.js";
export declare class RoundRepository {
    createRound(roomId: number, questionId: number): Promise<RoundWithQuestion>;
    findById(roomId?: number, roundId?: number, playerId?: string): Promise<({
        questions: {
            alternatives: {
                alternative_id: number;
                alternative_text: string;
            }[];
            question_id: number;
            question_text: string;
        };
        answers: {
            player_id: string;
            alternative_id: number;
            round_id: number;
            points: number;
            answered_at: Date;
            answer_id: number;
        }[];
        rooms: {
            _count: {
                roomQuestions: number;
            };
            time_limit: number;
            position: number;
        };
    } & {
        room_id: number;
        question_id: number;
        round_id: number;
        opened_at: Date;
        closed_at: Date | null;
    }) | null>;
    updateRound(roundId: number): Promise<void>;
}
//# sourceMappingURL=round.repository.d.ts.map