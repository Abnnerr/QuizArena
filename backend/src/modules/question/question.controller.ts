import type { Request, Response } from "express";
import type { IQuestionService } from "./contracts/question.service.contract.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { CreateQuestionDTO } from "./schema/createQuestion.js";
import { AppError } from "../../error/AppError.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import type { UpdateQuestionDTO } from "./schema/updateQuestion.js";

export class QuestionController {
    constructor(private readonly service: IQuestionService) {
        this.createQuestion = this.createQuestion.bind(this)
        this.findQuestions = this.findQuestions.bind(this)
        this.updateQuestion = this.updateQuestion.bind(this)
        this.deleteQuestionRoom = this.deleteQuestionRoom.bind(this)
        this.deleteQuestion = this.deleteQuestion.bind(this)
        this.addtoRoom = this.addtoRoom.bind(this)
    }
    async createQuestion(req: Request<{}, {}, CreateQuestionDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.createQuestion(req.body, req.user!)
            return HttpResponse.success(res, 201, "Question criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }
    async findQuestions(req: Request<{}, {}, CreateQuestionDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.createQuestion(req.body, req.user!)
            return HttpResponse.success(res, 201, "Question criado", result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }
    async updateQuestion(req: Request<{ questionId: string }, {}, UpdateQuestionDTO, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.updateQuestion(Number(req.params.questionId), req.body, req.user?.id!)

            return HttpResponse.success(res, 201, "Question criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }
    async deleteQuestionRoom(req: Request<{ roomId: string, questionId: string }, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            console.log('chegou');

            await this.service.deleteQuestionRoom(Number(req.params.roomId), Number(req.params.questionId), req.user?.id!)

            return HttpResponse.success(res, 201, "Question criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }
    async deleteQuestion(req: Request<{ roomId: string, questionId: string }, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            console.log('chegou');

            await this.service.deleteQuestion(Number(req.params.questionId), req.user?.id!)

            return HttpResponse.success(res, 201, "Question criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }
    async addtoRoom(req: Request<{ roomId: string, questionId: string }, {}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {

            await this.service.addToRoom(Number(req.params.roomId), Number(req.params.questionId), req.user?.id!)

            return HttpResponse.success(res, 201, "Question criado")
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Erro ao cria question')
        }
    }

}