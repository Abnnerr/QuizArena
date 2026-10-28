import { AppError } from "../error/AppError.js";
export class PolicyMiddleware {
    static ensureRolePermission(permission, ...roles) {
        return (req, _res, next) => {
            if (roles.length > 0 && !roles.includes(req.user?.role)) {
                throw new AppError(403, "Acesso negado");
            }
            if (!req.user?.permissions.includes(permission)) {
                throw new AppError(403, 'voce nao tem permissao');
            }
            next();
        };
    }
}
//# sourceMappingURL=policy.middleware.js.map