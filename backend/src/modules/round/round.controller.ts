import type { Request, Response } from "express";
import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { RoundService } from "./round.service.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { FinishedDTO } from "./schema/finished.schema.js";

export class RoundController {
    constructor(private readonly service: RoundService) {
        this.roundFinished = this.roundFinished.bind(this)
        this.findRound = this.findRound.bind(this)
    }



    async findRound(req: Request<{ roomCode: string }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.findRound(req.params.roomCode)

            return HttpResponse.success(res, 200, 'Round Encontrado', result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao  encontrar round na partida')
        }
    }
    async roundFinished(req: Request<{ roomCode: string }, {}, FinishedDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.roundFinished(req.params.roomCode, req.body.round_id)
            return HttpResponse.success(res, 201, "Round terminado e novo criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao terminar a partida')
        }
    }
}