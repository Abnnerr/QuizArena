import type { Rooms, UserRoom } from "@prisma/client"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { AuthPayload } from "../../../types/generic.js"

export type IRoomRepository = {
    create: (dados: RoomCreateDTO, ids: number[]) => Promise<Rooms>
    findByRoom: (name?: string, id?: number) => Promise<Rooms | null>
    join: (user: AuthPayload, roomId: number) => Promise<void>
    countPlayers: (id: number) => Promise<number>
    findPlayer: (id: string, roomId: number) => Promise<UserRoom | null>
    countQuestions: (id: number) => Promise<number>
    update: (id: number, status: string) => Promise<void>
}