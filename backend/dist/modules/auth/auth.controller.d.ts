import type { Request, Response } from "express";
import type { ResponseDTO } from "../../types/generic.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { IAuthController } from "./contracts/auth.controller.contract.js";
import type { IAuthService } from "./contracts/auth.service.contract.js";
import type { LoginDTO } from "./schema/login.schema.js";
import type { ForgotDTO } from "./schema/forgot.schema.js";
import type { ResetDTO } from "./schema/reset.schema.js";
export declare class AuthController implements IAuthController {
    private readonly service;
    constructor(service: IAuthService);
    register(req: Request<{}, {}, RegisterDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    login(req: Request<{}, {}, LoginDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    forgot(req: Request<{}, {}, ForgotDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    reset(req: Request<{
        token: string;
    }, {}, ResetDTO, {}>, res: Response<ResponseDTO>): Promise<Response>;
    me(req: Request<{}, {}, {}, {}>, res: Response<ResponseDTO>): Promise<Response>;
}
//# sourceMappingURL=auth.controller.d.ts.map