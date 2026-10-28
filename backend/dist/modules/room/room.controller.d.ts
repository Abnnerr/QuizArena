import type { Request, Response } from "express";
import type { ResponseDTO } from "../../types/generic.js";
import type { IRoomController } from "./contracts/room.controller.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { JoinDTO } from "./schema/roomJoin.schema.js";
export declare class RoomController implements IRoomController {
    private readonly service;
    constructor(service: IRoomService);
    create(req: Request<{}, {}, RoomCreateDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    findRoom(req: Request<{
        name: string;
    }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
    join(req: Request<{
        name: string;
    }, {}, JoinDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    start(req: Request<{
        id: string;
    }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
    limparRoom(req: Request<{
        roomCode: string;
        roundId: string;
    }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
}
//# sourceMappingURL=room.controller.d.ts.map