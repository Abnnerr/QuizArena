import type { Players, RoomPlayer } from "@prisma/client";
export declare class PlayerRepository {
    countPlayers(id: number): Promise<number>;
    create(name: string): Promise<Players>;
    findPlayerRoom(id: string, roomId: number): Promise<RoomPlayer | null>;
    findPlayer(name: string): Promise<Players | null>;
    findPlayers(roomId: number): Promise<({
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
    readyPlayer(id: string, roomId: number, ready: boolean): Promise<any>;
    playerScore(player_id: string): Promise<any>;
    updatePlayerScore(roomId: number, playerId: string, score: number): Promise<void>;
    deletePlayer(id: string): Promise<void>;
}
//# sourceMappingURL=player.repository.d.ts.map