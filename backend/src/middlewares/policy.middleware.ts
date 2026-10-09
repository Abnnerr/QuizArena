import type { NextFunction, Request, Response } from "express";
import { AppError } from "../error/AppError.js";

export class PolicyMiddleware {
    static ensureRolePermission(permission: string, ...roles: string[]) {
        return (req: Request, res: Response, next: NextFunction) => {
            
            if (roles.length > 0 && !roles.includes(req.user?.role!)) {
                throw new AppError(403, "Acesso negado");
            }
            if (!req.user?.permissions.includes(permission)) {
                throw new AppError(403, 'voce nao tem permissao')
            }

            next()
        }

    }
}