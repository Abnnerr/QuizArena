import type { Rooms } from "@prisma/client";
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js";
import type { PlayerService } from "../../players/player.service.js";
import type { AuthPayload } from "../../../types/generic.js";

export type IRoomService = {
    setPlayerService(playerService: PlayerService): void;
    createRoom(
        user: AuthPayload,
        dados: RoomCreateDTO
    ): Promise<string>;
    findRoom(code: string): Promise<Rooms>;
    joinRoom(
        roomCode: string,
        userName: string
    ): Promise<{
        player_id: string;
        player_name: string;
    }>;
    leaveRoom(id: string, roomCode: string): Promise<void>;
    start(user: AuthPayload, id: number): Promise<void>;
    updateRoomPosition(roomCode: string): Promise<Rooms>;
    findAlternatives(
        questionId: number,
        alternativeId?: number
    ): Promise<{ alternative_id: number, is_correct: boolean } | null>;
    getAnswerStatistics(
        roundId: number,
        questionId: number
    ): Promise<{
        alternativeId: number;
        isCorrect: boolean;
        count: number;
    }[]>;
    findAlternativesIncorret(
        questionId: number
    ): Promise<{ alternative_id: number }[]>;
    limparRoom(
        roomCode: string,
        roundId: number
    ): Promise<void>;
}