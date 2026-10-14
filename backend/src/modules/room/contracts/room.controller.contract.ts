import type { Request, Response } from "express"
import type { ResponseDTO } from "../../../types/generic.js"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { JoinDTO } from "../schema/roomJoin.schema.js"
import type { ReadyDTO } from "../schema/roomReady.schema.js"

export type IRoomController = {
    create: (req: Request<{}, {}, RoomCreateDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    findRoom: (req: Request<{ name: string }, {}, {}, {}>, res: Response<ResponseDTO>) => Promise<Response>
    join: (req: Request<{ name: string }, {}, JoinDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    ready: (req: Request<{ id: string, roomId: string }, {}, ReadyDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    start: (req: Request<{ id: string }, {}, {}, {}>, res: Response<ResponseDTO>) => Promise<Response>
}