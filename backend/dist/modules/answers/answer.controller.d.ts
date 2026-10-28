import type { Request, Response } from "express";
import type { AnswerService } from "./answer.service.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { CreateAnswerDTO } from "./schema/createAnswer.schema.js";
export declare class AnswerController {
    private readonly service;
    constructor(service: AnswerService);
    createAnswer(req: Request<{
        roomCode: string;
    }, {}, CreateAnswerDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
}
//# sourceMappingURL=answer.controller.d.ts.map