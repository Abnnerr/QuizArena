import { beforeEach, describe, expect, it, vi } from "vitest"
import type { IAuthService } from "../contracts/auth.service.contract.js"
import type { IAuthController } from "../contracts/auth.controller.contract.js"
import { AuthController } from "../auth.controller.js";
import { type Request, type Response } from "express";
import { HttpResponse } from "../../../shared/response/httpResponse.js";
import { AppError } from "../../../error/AppError.js";


vi.mock("../../../shared/response/httpResponse.js", () => ({
    HttpResponse: {
        success: vi.fn(),
        warning: vi.fn()
    }
}));

describe("AuthController", () => {
    let authController: IAuthController;
    let authService: IAuthService;

    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        vi.clearAllMocks();

        authService = {
            register: vi.fn().mockResolvedValue(undefined),
            login: vi.fn().mockResolvedValue({
                token: "token-falso",
                user: {
                    role_name: "USER",
                    permissions: [],
                    user_id: "123",
                    user_username: "Jonas",
                    user_email: "abner@gmail.com"
                }
            })
        } as unknown as IAuthService;

        authController = new AuthController(authService);

        req = {
            body: {
                userName: "Jonas",
                email: "abner@gmail.com",
                password: "#Abner123456789",
            },
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis(),
        };
    });

    describe("Erro e Sucesso de Register Usuario", () => {
        //Sucesso
        it("deve retornar 201 ao registrar usuario", async () => {
            await authController.register(
                req as Request,
                res as Response
            );

            expect(authService.register).toHaveBeenCalledWith(req.body);

            expect(HttpResponse.success).toHaveBeenCalledWith(
                res,
                201,
                "Olhe sua caixa de Emails"
            );
        });
        // Error 
        it("deve retornar erro ao registrar usuario com email existente", async () => {

            vi.mocked(authService.register).mockRejectedValue(
                new AppError(
                    409,
                    "Não foi possível realizar o cadastro, email ja cadastrado"
                )
            );

            await authController.register(
                req as Request,
                res as Response
            );

            expect(authService.register).toHaveBeenCalledWith(req.body);

            expect(HttpResponse.warning).toHaveBeenCalledWith(
                res,
                409,
                "Não foi possível realizar o cadastro, email ja cadastrado"
            );
        });
    });

    // describe('Erro e Sucesso Login Usuario', () => {
    //     it("deve retornar 200 ao realizar login", async () => {
    //         await authController.login(
    //             req as Request,
    //             res as Response
    //         )

    //         expect(authService.login).toHaveBeenCalledWith(req.body);
    //         expect(HttpResponse.success).toHaveBeenCalledWith(
    //             res,
    //             200,
    //             'Usuario Logado',
    //         )
    //     });

    //     // it("deve retornar erro quando o email não existir", async () => {
    //     //     // Teste de email inexistente
    //     // });

    //     // it("deve retornar erro quando a senha estiver incorreta", async () => {
    //     //     // Teste de senha incorreta
    //     // });

    //     // it("deve retornar 500 em caso de erro inesperado", async () => {
    //     //     // Teste de erro inesperado
    //     // });
    // })
});