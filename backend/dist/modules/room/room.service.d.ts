import type { Rooms } from "@prisma/client";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { PlayerService } from "../players/player.service.js";
import type { RoundRepository } from "../round/round.repository.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { QuestionService } from "../question/question.service.js";
export declare class RoomService implements IRoomService {
    private readonly repo;
    private readonly serviceQuestion;
    private readonly repoRound;
    private readonly socket;
    private playerService;
    constructor(repo: IRoomRepository, serviceQuestion: QuestionService, repoRound: RoundRepository, socket: SocketService);
    setPlayerService(playerService: PlayerService): void;
    createRoom(user: AuthPayload, dados: RoomCreateDTO): Promise<string>;
    findRoom(code: string): Promise<Rooms>;
    joinRoom(roomCode: string, userName: string): Promise<any>;
    leaveRoom(id: string, roomCode: string): Promise<void>;
    start(user: AuthPayload, id: number): Promise<void>;
    updateRoomPosition(roomCode: string): Promise<void>;
    findAlternatives(questionId: number, alternativeId: number): Promise<any>;
    limparRoom(roomCode: string, roundId: number): Promise<void>;
}
//# sourceMappingURL=room.service.d.ts.map