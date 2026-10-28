import { AppError } from "../error/AppError.js";
import { JwtService } from "../shared/services/jwt.service.js";
import { AuthRepository } from "../modules/auth/auth.repository.js";
export class AuthMiddleware {
    static async validate(req, _res, next) {
        try {
            const cookie = req.cookies?.["access_token"];
            // console.log(cookie);
            const [bearer, authoToken] = req.headers.authorization?.split(" ") ?? [];
            const token = bearer === 'Bearer' ? authoToken : cookie ? cookie : false;
            if (!token) {
                throw new AppError(401, "Token de autenticação não enviado");
            }
            const verify = new JwtService().verify(token);
            // console.log(verify);
            const user = await new AuthRepository().findUser(undefined, undefined, verify.id);
            if (!user) {
                throw new AppError(401, "Usuário não encontrado");
            }
            req.user = verify;
            next();
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(401, "Token inválido ou expirado");
        }
    }
}
//# sourceMappingURL=auth.middleware.js.map