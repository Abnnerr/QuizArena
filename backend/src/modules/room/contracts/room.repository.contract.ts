import type { RoomPlayer, Rooms } from "@prisma/client"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { AuthPayload } from "../../../types/generic.js"

export type IRoomRepository = {
    create: (userI: string, dados: RoomCreateDTO, ids: number[]) => Promise<Rooms>
    findByRoom: (name?: string, roomCode?: string, id?: number) => Promise<Rooms | null>
    joinRoom: (userId: string, roomId: number) => Promise<void>
    leaveRoom: (id: string, roomId: number) => Promise<void>
    readyPlayer: (id: string, roomId: number, ready: boolean) => Promise<any>
    countPlayers: (id: number) => Promise<number>
    findPlayer: (id: string, roomId: number) => Promise<RoomPlayer | null>
    // countQuestions: (id: number) => Promise<number>
    roomUpdate: (id: number, status: string) => Promise<void>
}