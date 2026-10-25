import type { RoomPlayer, Rooms } from "@prisma/client"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { AuthPayload } from "../../../types/generic.js"

export type IRoomRepository = {
    createRoom: (userI: string, dados: RoomCreateDTO, ids: number[]) => Promise<Rooms>
    findByRoom: (name?: string, roomCode?: string, id?: number) => Promise<Rooms | null>
    joinRoom: (userId: string, roomId: number) => Promise<void>
    leaveRoom: (id: string, roomId: number) => Promise<void>
    // countQuestions: (id: number) => Promise<number>
    roomUpdate: (id: number, status: string) => Promise<void>
    findAlternative: (iquestionId: number, alternativeId: number) => Promise<any>
}