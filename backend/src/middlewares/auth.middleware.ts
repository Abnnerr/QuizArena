import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError.js";
import { JwtService } from "../shared/services/jwt.service.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
import type { AuthPayload } from "../types/generic.js";

export class AuthMiddleware {
    static async validate(req: Request, res: Response, next: NextFunction) {
        try {
            const [bearer, token] = req.headers.authorization?.split(" ") ?? [];

            if (bearer !== "Bearer" || !token) {
                throw new AppError(401, "Token de autenticação não enviado");
            }

            const verify = new JwtService().verify(token) as AuthPayload;
            
            const user = await new AuthRepository().login(undefined, verify.id);

            if (!user) {
                throw new AppError(401, "Usuário não encontrado");
            }

            req.user = verify;

            next();
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(401, "Token inválido ou expirado");
        }
    }
}