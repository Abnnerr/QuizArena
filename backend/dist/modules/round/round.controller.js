import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
export class RoundController {
    service;
    constructor(service) {
        this.service = service;
        this.roundFinished = this.roundFinished.bind(this);
        this.findRound = this.findRound.bind(this);
    }
    async findRound(req, res) {
        try {
            const result = await this.service.findRound(req.params.roomCode);
            return HttpResponse.success(res, 200, 'Round Encontrado', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao  encontrar round na partida');
        }
    }
    async roundFinished(req, res) {
        try {
            await this.service.roundFinished(req.params.roomCode, req.body.round_id);
            return HttpResponse.success(res, 201, "Round terminado e novo criado");
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao terminar a partida');
        }
    }
}
//# sourceMappingURL=round.controller.js.map