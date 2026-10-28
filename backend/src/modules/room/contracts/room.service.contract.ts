import type { Rooms } from "@prisma/client"
import type { AuthPayload } from "../../../types/generic.js"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"


export type IRoomService = {
    createRoom: (user: AuthPayload, dados: RoomCreateDTO) => Promise<string>
    findRoom: (name: string) => Promise<Rooms>
    joinRoom: (roomName: string, userName: string) => Promise<any>
    leaveRoom: (id: string, roomCode: string) => Promise<void>
    start: (user: AuthPayload, id: number) => Promise<void>
    limparRoom: (roomCode: string, roundId: number) => Promise<void>
    updateRoomPosition: (roomCode: string) => Promise<any>
}