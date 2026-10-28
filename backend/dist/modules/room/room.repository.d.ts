import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { Rooms } from "@prisma/client";
import type { RoomWithPlayers } from "./dto/room.dto.js";
export declare class RoomRepository implements IRoomRepository {
    createRoom(userId: string, dados: RoomCreateDTO, ids: number[]): Promise<Rooms>;
    findByRoom(name?: string, roomCode?: string, id?: number): Promise<RoomWithPlayers | null>;
    joinRoom(userId: string, roomId: number): Promise<void>;
    leaveRoom(id: string, roomId: number): Promise<void>;
    countQuestions(id: number): Promise<number>;
    roomUpdate(id: number, status?: string): Promise<any>;
    findAlternative(questionId: number, alternativeId: number): Promise<{
        is_correct: boolean;
    } | null>;
    limparRoom(roomId: number): Promise<void>;
}
//# sourceMappingURL=room.repository.d.ts.map