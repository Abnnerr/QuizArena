
import type { RoomPlayer } from "@prisma/client";
import type { Players } from "@prisma/client";

export type IPlayerService = {
    countPlayers(roomId: number): Promise<number>;

    createPlayer(name: string): Promise<Players>;

    findPlayerRoom(
        username: string,
        roomId: number
    ): Promise<RoomPlayer | null>;

    readyPlayer(
        playerId: string,
        roomCode: string,
        ready: boolean
    ): Promise<void>;

    updatePlayerScore(
        roomId: number,
        playerId: string,
        scores: number
    ): Promise<void>;

    deletePlayer(id: string): Promise<void>;

    findPodium(code: string): Promise<
        (RoomPlayer & {
            players: {
                player_id: string;
                player_name: string;
            };
        })[]
    >;

    powerUp(
        code: string,
        playerId: string,
        powerId: number,
        targetPlayerId?: string,
        userName?: string
    ): Promise<void>;
}
