import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
export class RoomController {
    service;
    constructor(service) {
        this.service = service;
        this.create = this.create.bind(this);
        this.findRoom = this.findRoom.bind(this);
        this.join = this.join.bind(this);
        this.start = this.start.bind(this);
        this.limparRoom = this.limparRoom.bind(this);
    }
    async create(req, res) {
        try {
            const result = await this.service.createRoom(req.user, req.body);
            return HttpResponse.success(res, 201, 'Sala criada', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar sala');
        }
    }
    async findRoom(req, res) {
        try {
            const result = await this.service.findRoom(req.params.name);
            return HttpResponse.success(res, 200, 'Sala encontrada', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro sala nao encontrada');
        }
    }
    async join(req, res) {
        try {
            const player = await this.service.joinRoom(req.params.name, req.body.userName);
            return HttpResponse.success(res, 200, 'usuario entrou na sala', player);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao entrar na sala');
        }
    }
    async start(req, res) {
        try {
            await this.service.start(req.user, Number(req.params.id));
            return HttpResponse.success(res, 201, 'partida da sala começou');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao começar na partida');
        }
    }
    async limparRoom(req, res) {
        try {
            await this.service.limparRoom(req.params.roomCode, Number(req.params.roundId));
            return HttpResponse.success(res, 200, 'Sala limpa');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao começar na partida');
        }
    }
}
//# sourceMappingURL=room.controller.js.map