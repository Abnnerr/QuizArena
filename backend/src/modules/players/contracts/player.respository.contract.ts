
import type { Players, RoomPlayer } from "@prisma/client";

export type IPlayerRepository = {
    countPlayers(id: number): Promise<number>;
    create(name: string): Promise<Players>;
    findPlayerRoom(username: string, roomId: number): Promise<RoomPlayer | null>;
    findPlayer(name: string): Promise<Players | null>;
    findPlayers(roomId: number): Promise<
        (RoomPlayer & {
            players: {
                player_id: string;
                player_name: string;
            };
        })[]
    >;

    readyPlayer(
        id: string,
        roomId: number,
        ready: boolean
    ): Promise<RoomPlayer>;

    playerScore: (roomId: number, player_id: string) => Promise<{ score: number } | null>

    updatePlayerScore(
        roomId: number,
        playerId: string,
        score: number
    ): Promise<void>;

    deletePlayer(roomId: number, id: string): Promise<void>
}
