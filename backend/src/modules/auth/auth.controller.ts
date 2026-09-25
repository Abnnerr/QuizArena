import type { Request, Response } from "express";
import { HttpResponse } from "../../shared/response/httpResponse.js";
import { AppError } from "../../error/AppError.js";
import type { ResponseDTO } from "../../types/generic.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { IAuthController } from "./contracts/auth.controller.contract.js";
import type { IAuthService } from "./contracts/auth.service.contract.js";
import type { LoginDTO } from "./schema/login.schema.js";
import type { ForgotDTO } from "./schema/forgot.schema.js";
import type { TokenDTO } from "./dto/auth.dto.js";
import type { ResetDTO } from "./schema/reset.schema.js";

export class AuthController implements IAuthController {
    constructor(private readonly service: IAuthService) {
        this.register = this.register.bind(this)
        this.login = this.login.bind(this)
        this.forgot = this.forgot.bind(this)
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
    async login(req: Request<{}, {}, LoginDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {
            const result = await this.service.login(req.body)

            return HttpResponse.success(res, 201, 'Usuario registrado', result)
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario')
        }
    }
    async forgot(req: Request<{}, {}, ForgotDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {

            await this.service.forgot(req.body.email)

            return HttpResponse.success(res, 201, 'Usuario registrado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario')
        }
    }

    async reset(req: Request<TokenDTO, {}, ResetDTO, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {

            await this.service.reset(req.params.token, req.body.password)

            return HttpResponse.success(res, 201, 'Usuario registrado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario')
        }
    }
    async me(req: Request<{}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response> {
        try {


            return HttpResponse.success(res, 201, 'Usuario registrado')
        } catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message)
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario')
        }
    }
}