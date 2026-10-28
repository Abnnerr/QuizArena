import { HttpResponse } from "../../shared/response/httpResponse.js";
import { AppError } from "../../error/AppError.js";
export class PlayerController {
    service;
    constructor(service) {
        this.service = service;
        this.ready = this.ready.bind(this);
        this.findPodium = this.findPodium.bind(this);
    }
    async ready(req, res) {
        try {
            await this.service.readyPlayer(req.params.playerId, req.params.roomCode, req.body.ready);
            return HttpResponse.success(res, 200, 'player pronto');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Erro ao player ficar pronto');
        }
    }
    async findPodium(req, res) {
        try {
            const result = await this.service.findPodium(req.params.roomCode);
            return HttpResponse.success(res, 200, 'players encontrados', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, error.message);
        }
    }
}
//# sourceMappingURL=player.controller.js.map