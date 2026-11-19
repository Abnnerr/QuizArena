import type { Rooms } from "@prisma/client"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { RoomWithPlayers } from "../dto/room.dto.js";


export type IRoomRepository = {
    createRoom(
        userId: string,
        dados: RoomCreateDTO,
        ids: number[]
    ): Promise<Rooms>;
    findByRoom(name?: string, roomCode?: string, id?: number): Promise<RoomWithPlayers | null>;
    joinRoom(userId: string, roomId: number): Promise<void>;
    leaveRoom(id: string, roomId: number): Promise<void>;
    countQuestions(id: number): Promise<number>;
    roomUpdate(id: number, status?: string): Promise<Rooms>;
    findAlternative(
        questionId: number,
        alternativeId?: number
    ): Promise<{ alternative_id: number, is_correct: boolean } | null>;

    findAlternativeIncorret(
        questionId: number
    ): Promise<{ alternative_id: number }[]>;

    getAnswerStatistics(
        roundId: number,
        questionId: number
    ): Promise<{
        alternativeId: number;
        isCorrect: boolean;
        count: number;
    }[]>;

    limparRoom(roomId: number): Promise<void>;
    
}