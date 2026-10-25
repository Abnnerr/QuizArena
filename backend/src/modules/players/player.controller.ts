import type { Request, Response } from "express"
import type { ResponseDTO } from "../../types/generic.js"
import type { PlayerService } from "./player.service.js"
import { HttpResponse } from "../../shared/response/httpResponse.js"
import { AppError } from "../../error/AppError.js"
import type { ReadyDTO } from "./schema/playerReady.schema.js"

export class PlayerController {
    constructor(private readonly service: PlayerService) {
        this.ready = this.ready.bind(this)
    }

    async ready(req: Request<{ playerId: string, roomCode: string }, {}, ReadyDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.readyPlayer(req.params.playerId, req.params.roomCode, req.body.ready)
            return HttpResponse.success(res, 200, 'player pronto')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao player ficar pronto')
        }
    }
}