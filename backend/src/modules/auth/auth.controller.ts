import type { Request, Response } from "express";
import type { AuthService } from "./auth.service.js";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import { AppError } from "../../error/AppError.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { RegisterDTO } from "./schema/register.schema.js";

export class AuthController {
    constructor(private readonly service: AuthService) {

        this.register = this.register.bind(this)
    }

    async register(req: Request<{}, {}, RegisterDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            await this.service.register(req.body)
            
            return HttpResponse.success(res, 201, 'Usuario registrado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario')
        }
    }
}