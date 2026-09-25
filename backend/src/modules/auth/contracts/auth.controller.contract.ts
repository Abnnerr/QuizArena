import type { Request, Response } from "express";
import type { ResponseDTO } from "../../../types/generic.js";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { LoginDTO } from "../schema/login.schema.js";
import type { ForgotDTO } from "../schema/forgot.schema.js";

export interface IAuthController {
    register: (req: Request<{}, {}, RegisterDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    login: (req: Request<{}, {}, LoginDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    forgot: (req: Request<{}, {}, ForgotDTO, {}>, res: Response<ResponseDTO>) => Promise<Response>
    me: (req: Request<{}, {}, {}, {}>, res: Response<ResponseDTO>) => Promise<Response>
}