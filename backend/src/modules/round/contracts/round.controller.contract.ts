import type { Request, Response } from "express";
import type { ResponseDTO } from "../../../types/generic.js";
import type { FinishedDTO } from "../schema/finished.schema.js";


export type IRoundController = {
    findRound(
        req: Request<
            { roomCode: string; playerId: string },
            {},
            {},
            {}
        >,
        res: Response<ResponseDTO>
    ): Promise<Response>;

    roundFinished(
        req: Request<{ roomCode: string }, {}, FinishedDTO, {}>,
        res: Response<ResponseDTO>
    ): Promise<Response>;
}