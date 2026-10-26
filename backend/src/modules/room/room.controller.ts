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
        this.findRoom = this.findRoom.bind(this)
        this.join = this.join.bind(this)
        this.start = this.start.bind(this)
        this.limparRoom = this.limparRoom.bind(this)
    }

    async create(req: Request<{}, {}, RoomCreateDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.createRoom(req.user!, req.body)
            return HttpResponse.success(res, 201, 'Sala criada', result)
        } catch (error: any) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar sala')
        }
    }
    async findRoom(req: Request<{ name: string }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {

            const result = await this.service.findRoom(req.params.name)
            return HttpResponse.success(res, 200, 'Sala encontrada', result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro sala nao encontrada')
        }
    }
    async join(req: Request<{ name: string }, {}, JoinDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const player = await this.service.joinRoom(req.params.name, req.body.userName)
            return HttpResponse.success(res, 200, 'usuario entrou na sala', player)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao entrar na sala')
        }
    }

    async start(req: Request<{ id: string }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
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

    async limparRoom(req: Request<{ roomCode: string, roundId: string }, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.limparRoom(req.params.roomCode, Number(req.params.roundId))
            return HttpResponse.success(res, 200, 'Sala limpa')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao começar na partida')
        }
    }
}