import type { AuthPayload } from "../../../types/generic.js"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"

export type IRoomService = {
    create: (user: AuthPayload, dados: RoomCreateDTO) => Promise<void>
    join: (user: AuthPayload, name: string) => Promise<void>
    start(user: AuthPayload, id: number): Promise<void>
}