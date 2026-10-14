import type { Rooms } from "@prisma/client"
import type { AuthPayload } from "../../../types/generic.js"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"

export type IRoomService = {
    create: (user: AuthPayload, dados: RoomCreateDTO) => Promise<string>
    findRoom: (name: string) => Promise<Rooms>
    join: (roomName: string, userName: string) => Promise<any>
    leave: (id: string, roomCode: string) => Promise<void>
    ready: (id: string, roomId: string, ready: boolean) => Promise<void>
    start: (user: AuthPayload, id: number) => Promise<void>
}