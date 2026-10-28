import type { PlayerService } from "../players/player.service.js";
import type { RoomService } from "../room/room.service.js";
import type { RoundService } from "../round/round.service.js";
import type { AnswerRepository } from "./answer.repository.js";
export declare class AnswerService {
    private readonly repo;
    private readonly roomService;
    private readonly roundService;
    private readonly playerService;
    constructor(repo: AnswerRepository, roomService: RoomService, roundService: RoundService, playerService: PlayerService);
    createAnswer(roomCode: string, roundId: number, playerId: string, alternativeId: number): Promise<{
        scores: number;
        isCorrect: any;
    }>;
}
//# sourceMappingURL=answer.service.d.ts.map