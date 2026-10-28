import { HttpResponse } from "../../shared/response/httpResponse.js";
import { AppError } from "../../error/AppError.js";
export class AuthController {
    service;
    constructor(service) {
        this.service = service;
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.forgot = this.forgot.bind(this);
        this.reset = this.reset.bind(this);
        this.me = this.me.bind(this);
    }
    async register(req, res) {
        try {
            await this.service.register(req.body);
            return HttpResponse.success(res, 201, 'Olhe sua caixa de Emails');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario', error.message);
        }
    }
    async login(req, res) {
        try {
            const result = await this.service.login(req.body);
            res.cookie('access_token', result.token, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env["NODE_MODE"] === 'production',
                maxAge: 60 * 1000 * 60
            });
            return HttpResponse.success(res, 200, 'Usuario logado', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Error ao logar Usuario');
        }
    }
    async forgot(req, res) {
        try {
            await this.service.forgot(req.body.email);
            return HttpResponse.success(res, 200, 'Usuario registrado');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Error ao registrar Usuario');
        }
    }
    async reset(req, res) {
        try {
            await this.service.reset(req.params.token, req.body.password);
            return HttpResponse.success(res, 200, 'Conta recuperada');
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'Error ao recuperar conta');
        }
    }
    async me(req, res) {
        try {
            const result = await this.service.me(req.user);
            return HttpResponse.success(res, 200, 'usuario encontrado', result);
        }
        catch (error) {
            if (error instanceof AppError) {
                return HttpResponse.warning(res, error.status, error.message);
            }
            return HttpResponse.warning(res, 500, 'erro ao encontrar usuario');
        }
    }
}
//# sourceMappingURL=auth.controller.js.map