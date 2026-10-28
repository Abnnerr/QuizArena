import type { Request, Response } from "express";
import type { ResponseDTO } from "../../types/generic.js";
import type { PlayerService } from "./player.service.js";
import type { ReadyDTO } from "./schema/playerReady.schema.js";
export declare class PlayerController {
    private readonly service;
    constructor(service: PlayerService);
    ready(req: Request<{
        playerId: string;
        roomCode: string;
    }, {}, ReadyDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    findPodium(req: Request<{
        roomCode: string;
    }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
}
//# sourceMappingURL=player.controller.d.ts.map