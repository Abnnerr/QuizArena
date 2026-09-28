import type { Request, Response } from "express"
import type { ResponseDTO } from "../../../types/generic.js"
import type { RoomCreateDTO } from "../schema/roomCreate.schema.js"
import type { JoinDTO } from "../schema/roomJoin.schema.js"

export type IRoomController = {
    create: (req: Request<{}, {}, RoomCreateDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    join: (req: Request<{}, {}, JoinDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    start: (req: Request<{ id: string }, {}, {}, {}>, res: Response<ResponseDTO>) => Promise<Response>
}