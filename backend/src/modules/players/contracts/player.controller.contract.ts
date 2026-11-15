import type { ResponseDTO } from "../../../types/generic.js";
import type { ReadyDTO } from "../schema/playerReady.schema.js";
import type { Request, Response } from "express"

export interface IPlayerController {
    ready(
        req: Request<{ playerId: string; roomCode: string }, {}, ReadyDTO, {}>,
        res: Response<ResponseDTO>
    ): Promise<Response>;

    findPodium(
        req: Request<{ roomCode: string }, {}, {}, {}>,
        res: Response<ResponseDTO>
    ): Promise<Response>;

    powerUp(
        req: Request<
            { roomCode: string; playerId: string; powerId: string, userName: string },
            {},
            { target: string },
            {}
        >,
        res: Response<ResponseDTO>
    ): Promise<Response>;
}
