import type { Request, Response } from "express";
import type { ResponseDTO } from "../../types/generic.js";
import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { CreateAnswerDTO } from "./schema/createAnswer.schema.js";
import type { IAnswerService } from "./contracts/answer.service.contract.js";
import type { IAnswerController } from "./contracts/answer.controller.contract.js";

export class AnswerController implements IAnswerController {
    constructor(private readonly service: IAnswerService) {
        this.createAnswer = this.createAnswer.bind(this)
    }

    async createAnswer(req: Request<{ roomCode: string }, {}, CreateAnswerDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.createAnswer(
                req.params.roomCode,
                req.body.roundId,
                req.body.playerId,
                req.body.alternativeId
            )

            return HttpResponse.success(res, 201, 'Resposta Criado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar resposta')
        }
    }
}