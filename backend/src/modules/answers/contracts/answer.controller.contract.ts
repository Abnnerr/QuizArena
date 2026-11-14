
import type { Request, Response } from "express";
import type { ResponseDTO } from "../../../types/generic.js";
import type { CreateAnswerDTO } from "../schema/createAnswer.schema.js";

export type IAnswerController = {
    createAnswer(
        req: Request<{ roomCode: string }, {}, CreateAnswerDTO, {}>,
        res: Response<ResponseDTO>
    ): Promise<Response>;
}
