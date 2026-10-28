import type { PlayerRepository } from "./player.repository.js";
import type { RoomPlayer } from "@prisma/client";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { IRoomService } from "../room/contracts/room.service.contract.js";
export declare class PlayerService {
    private readonly repo;
    private readonly socket;
    private roomService;
    constructor(repo: PlayerRepository, socket: SocketService);
    setRoomService(roomService: IRoomService): void;
    countPlayers(roomId: number): Promise<number>;
    createPlayer(name: string): Promise<{
        player_id: string;
        player_name: string;
    }>;
    findPlayerRoom(id: string, roomId: number): Promise<RoomPlayer | null>;
    readyPlayer(playerId: string, roomCode: string, ready: boolean): Promise<void>;
    updatePlayerScore(roomId: number, playerId: string, scores: number): Promise<void>;
    deletePlayer(id: string): Promise<void>;
    findPodium(code: string): Promise<({
        players: {
            player_name: string;
        };
    } & {
        room_id: number;
        player_id: string;
        score: number;
        joined_at: Date;
        ready: boolean;
    })[]>;
}
//# sourceMappingURL=player.service.d.ts.map