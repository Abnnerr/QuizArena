import type { SocketService } from "../../shared/services/socket.service.js";
import type { QuestionService } from "../question/question.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
import type { RoundRepository } from "./round.repository.js";
export declare class RoundService {
    private readonly repo;
    private readonly roomService;
    private readonly questionService;
    private readonly socket;
    constructor(repo: RoundRepository, roomService: IRoomService, questionService: QuestionService, socket: SocketService);
    findRound(roomCode: string): Promise<any>;
    roundFinished(roomCode: string, round_id: number): Promise<void>;
}
//# sourceMappingURL=round.service.d.ts.map