import type { SocketService } from "../../../shared/services/socket.service.js";
import type { PowerRepository } from "../../powers/powers.repository.js";
import type { IRoomService } from "../../room/contracts/room.service.contract.js";

export interface PowerUpContext {
    code: string;
    playerId: string;
    roomId: number;
    powerId: number;
    position: number;
    roundId: number;
    questionId: number;
    targetPlayerId?: string | undefined;

    repoPower: PowerRepository;
    roomService: IRoomService;
    socket: SocketService;
}

export type PowerUpStrategy = (context: PowerUpContext) => Promise<void>;