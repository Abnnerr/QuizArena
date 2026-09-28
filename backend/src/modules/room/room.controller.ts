import type { Request, Response } from "express";
import type { ResponseDTO } from "../../types/generic.js";
import type { IRoomController } from "./contracts/room.controller.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { JoinDTO } from "./schema/roomJoin.schema.js";

export class RoomController implements IRoomController {
    constructor(private readonly service: IRoomService) {
        this.create = this.create.bind(this)
        this.join = this.join.bind(this)
        this.start = this.start.bind(this)
    }

    async create(req: Request<{}, {}, RoomCreateDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.create(req.user!, req.body)
            return HttpResponse.success(res, 201, 'Sala criada')
        } catch (error: any) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar sala')
        }
    }
    async join(req: Request<{}, {}, JoinDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.join(req.user!, req.body.name)
            return HttpResponse.success(res, 201, 'usuario entrou na sala')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao entrar na sala')
        }
    }
    async start(req: Request<{id: string}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.start(req.user!, Number(req.params.id))
            return HttpResponse.success(res, 201, 'partida da sala começou')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao começar na partida')
        }
    }
}