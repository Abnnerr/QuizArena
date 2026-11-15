import type { Request, Response } from "express"
import type { ResponseDTO } from "../../types/generic.js"
import { HttpResponse } from "../../shared/response/httpResponse.js"
import { AppError } from "../../error/AppError.js"
import type { ReadyDTO } from "./schema/playerReady.schema.js"
import type { IPlayerService } from "./contracts/player.service.contract.js"
import type { IPlayerController } from "./contracts/player.controller.contract.js"

export class PlayerController implements IPlayerController {
    constructor(private readonly service: IPlayerService) {
        this.ready = this.ready.bind(this)
        this.findPodium = this.findPodium.bind(this)
        this.powerUp = this.powerUp.bind(this)
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
    async findPodium(req: Request<{ roomCode: string }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.findPodium(req.params.roomCode)
            return HttpResponse.success(res, 200, 'players encontrados', result)
        } catch (error: any) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, error.message)
        }
    }
    async powerUp(req: Request<{ roomCode: string, playerId: string, powerId: string, userName: string }, {}, { target: string }, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {

            const { target } = req.body || {};
            await this.service.powerUp(req.params.roomCode, req.params.playerId, Number(req.params.powerId), target, req.params.userName)
            return HttpResponse.success(res, 200, 'players encontrados')
        } catch (error: any) {
            console.log(error);

            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, error.message)
        }
    }
}