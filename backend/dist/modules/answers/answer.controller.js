import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
export class AnswerController {
    service;
    constructor(service) {
        this.service = service;
        this.createAnswer = this.createAnswer.bind(this);
    }
    async createAnswer(req, res) {
        try {
            await this.service.createAnswer(req.params.roomCode, req.body.roundId, req.body.playerId, req.body.alternativeId);
            return HttpResponse.success(res, 201, 'Resposta Criado');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao criar resposta');
        }
    }
}
//# sourceMappingURL=answer.controller.js.map