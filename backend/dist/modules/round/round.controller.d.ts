import type { Request, Response } from "express";
import type { RoundService } from "./round.service.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { FinishedDTO } from "./schema/finished.schema.js";
export declare class RoundController {
    private readonly service;
    constructor(service: RoundService);
    findRound(req: Request<{
        roomCode: string;
    }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
    roundFinished(req: Request<{
        roomCode: string;
    }, {}, FinishedDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
}
//# sourceMappingURL=round.controller.d.ts.map