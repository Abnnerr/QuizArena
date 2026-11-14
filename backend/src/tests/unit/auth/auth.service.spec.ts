import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { AuthService } from "../../../modules/auth/auth.service.js";
import type { IAuthRepository } from "../../../modules/auth/contracts/auth.repository.contract.js";
import type { JwtService } from "../../../shared/services/jwt.service.js";
import type { BcryptService } from "../../../shared/services/bcrypt.service.js";
import type { AuthDomain } from "../../../modules/auth/domain/auth.domain.js";
import type { RegisterDTO } from "../../../modules/auth/schema/register.schema.js";
import type { LoginDTO } from "../../../modules/auth/schema/login.schema.js";
import type { UserWithRole } from "../../../modules/auth/dto/auth.dto.js";
import { enviarEmail } from "../../../shared/utils/email.js";
import { AppError } from "../../../error/AppError.js";
import type { AuthPayload } from "../../../types/generic.js";

vi.mock("../../../shared/utils/email.js", () => ({
    enviarEmail: vi.fn().mockResolvedValue(undefined)
}));

describe("AuthService", () => {
    let service: AuthService;

    let repo: IAuthRepository;
    let jwt: JwtService;
    let bcrypt: BcryptService;
    let domain: AuthDomain;

    const registerData: RegisterDTO = {
        userName: "jonas",
        email: "jonas@email.com",
        password: "Password123"
    } as RegisterDTO;

    const loginData = {
        userName: "jonas",
        password: "Password123"
    } as LoginDTO;

    const userMock = {
        user_id: "user-123",
        user_username: "jonas",
        user_email: "jonas@email.com",
        user_password: "hashed-password",
        Role: {
            role_name: "USER",
            rolePermissions: [
                {
                    permission: {
                        permission_name: "CREATE_ROOM"
                    }
                },
                {
                    permission: {
                        permission_name: "JOIN_ROOM"
                    }
                }
            ]
        }
    } as unknown as UserWithRole;

    const userDatabaseMock = {
        user_id: "user-123",
        user_username: "jonas",
        user_email: "jonas@email.com"
    };

    beforeEach(() => {
        repo = {
            register: vi.fn(),
            findUser: vi.fn(),
            reset: vi.fn()
        } as unknown as IAuthRepository;

        jwt = {
            sign: vi.fn().mockReturnValue("fake-token"),
            verify: vi.fn().mockReturnValue({
                id: "user-123"
            })
        } as unknown as JwtService;

        bcrypt = {
            hash: vi.fn().mockResolvedValue("hashed-password"),
            compare: vi.fn().mockResolvedValue(true)
        } as unknown as BcryptService;

        domain = {
            ensureRegister: vi.fn(),
            ensurePassword: vi.fn()
        } as unknown as AuthDomain;

        service = new AuthService(repo, jwt, bcrypt, domain);

        vi.mocked(enviarEmail).mockResolvedValue(undefined!);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });


    describe("register", () => {
        it("deve registrar um usuário com sucesso", async () => {
            vi.mocked(repo.register).mockResolvedValue(
                userDatabaseMock as never
            );

            await expect(service.register(registerData))
                .resolves.toBeUndefined();

            expect(domain.ensureRegister).toHaveBeenCalledWith(registerData);

            expect(domain.ensurePassword).toHaveBeenCalledWith(
                registerData.password
            );

            expect(bcrypt.hash).toHaveBeenCalledWith(
                registerData.password
            );

            expect(repo.register).toHaveBeenCalledWith({
                ...registerData,
                password: "hashed-password"
            });

            expect(enviarEmail).toHaveBeenCalled();
        });

        it("não deve registrar quando a validação dos dados falhar", async () => {
            vi.mocked(domain.ensureRegister).mockImplementation(() => {
                throw new AppError(400, "Dados inválidos");
            });

            await expect(service.register(registerData))
                .rejects.toThrow("Dados inválidos");

            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(repo.register).not.toHaveBeenCalled();
        });

        it("não deve registrar quando a senha for inválida", async () => {
            vi.mocked(domain.ensurePassword).mockImplementation(() => {
                throw new AppError(400, "Senha inválida");
            });

            await expect(service.register(registerData))
                .rejects.toThrow("Senha inválida");

            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(repo.register).not.toHaveBeenCalled();
        });

        it("deve retornar conflito quando o usuário já existir", async () => {
            vi.mocked(repo.register).mockResolvedValue(null as never);

            await expect(service.register(registerData))
                .rejects.toThrow("Não foi possível realizar o cadastro, email já cadastrado");

            expect(enviarEmail).not.toHaveBeenCalled();
        });

        it("deve concluir o cadastro mesmo se o envio do email falhar", async () => {
            vi.mocked(repo.register).mockResolvedValue(
                userDatabaseMock as never
            );

            vi.mocked(enviarEmail).mockRejectedValue(
                new Error("Falha no SMTP")
            );

            await expect(service.register(registerData))
                .resolves.toBeUndefined();

            expect(repo.register).toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(bcrypt.hash).mockRejectedValue(
                new Error("Erro interno")
            );

            await expect(service.register(registerData))
                .rejects.toThrow("Erro ao registrar usuário");
        });
    });

    // ==========================================
    // LOGIN
    // ==========================================

    describe("login", () => {
        it("deve realizar login com sucesso", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            const result = await service.login(loginData);

            expect(result).toEqual({
                user: {
                    user_id: "user-123",
                    user_username: "jonas",
                    user_email: "jonas@email.com",
                    role_name: "USER",
                    permissions: ["CREATE_ROOM", "JOIN_ROOM"]
                },
                token: "fake-token"
            });

            expect(repo.findUser).toHaveBeenCalledWith("jonas");

            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginData.password,
                userMock.user_password
            );

            expect(jwt.sign).toHaveBeenCalledWith(
                "user-123",
                "USER",
                ["CREATE_ROOM", "JOIN_ROOM"],
                "3h"
            );
        });

        it("não deve realizar login quando o usuário não existir", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(null);

            await expect(service.login(loginData))
                .rejects.toThrow("E-mail ou senha inválidos");

            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it("não deve realizar login com senha incorreta", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            vi.mocked(bcrypt.compare).mockResolvedValue(false);

            await expect(service.login(loginData))
                .rejects.toThrow("E-mail ou senha inválidos");

            expect(jwt.sign).not.toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(repo.findUser).mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(service.login(loginData))
                .rejects.toThrow("Erro ao realizar login");
        });

        it("não deve retornar a senha do usuário", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            const result = await service.login(loginData);

            expect(result.user).not.toHaveProperty("user_password");
        });
    });


    describe("forgot", () => {
        const email = "jonas@email.com";

        it("deve solicitar recuperação de senha com sucesso", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            await expect(service.forgot(email))
                .resolves.toBeUndefined();

            expect(repo.findUser).toHaveBeenCalledWith(
                undefined,
                email
            );

            expect(jwt.sign).toHaveBeenCalledWith(
                "user-123",
                "USER",
                [],
                "10m"
            );

            expect(enviarEmail).toHaveBeenCalled();
        });

        it("deve retornar erro quando o usuário não existir", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(null);

            await expect(service.forgot(email))
                .rejects.toThrow("Usuário não encontrado");

            expect(jwt.sign).not.toHaveBeenCalled();
            expect(enviarEmail).not.toHaveBeenCalled();
        });

        it("deve concluir a solicitação mesmo se o envio do email falhar", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            vi.mocked(enviarEmail).mockRejectedValue(
                new Error("Falha no SMTP")
            );

            await expect(service.forgot(email))
                .resolves.toBeUndefined();

            expect(jwt.sign).toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(repo.findUser).mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(service.forgot(email))
                .rejects.toThrow("Erro ao recuperar conta");
        });
    });


    describe("reset", () => {
        const token = "reset-token";
        const newPassword = "NewPassword123";

        it("deve redefinir a senha com sucesso", async () => {
            vi.mocked(repo.reset).mockResolvedValue(
                userDatabaseMock as never
            );

            await expect(service.reset(token, newPassword))
                .resolves.toBeUndefined();

            expect(domain.ensurePassword).toHaveBeenCalledWith(
                newPassword
            );

            expect(jwt.verify).toHaveBeenCalledWith(token);

            expect(bcrypt.hash).toHaveBeenCalledWith(newPassword);

            expect(repo.reset).toHaveBeenCalledWith(
                "user-123",
                "hashed-password"
            );

            expect(enviarEmail).toHaveBeenCalled();
        });

        it("não deve redefinir a senha quando ela for inválida", async () => {
            vi.mocked(domain.ensurePassword).mockImplementation(() => {
                throw new AppError(400, "Senha inválida");
            });

            await expect(service.reset(token, newPassword))
                .rejects.toThrow("Senha inválida");

            expect(jwt.verify).not.toHaveBeenCalled();
            expect(repo.reset).not.toHaveBeenCalled();
        });

        it("deve retornar erro quando o usuário não existir", async () => {
            vi.mocked(repo.reset).mockResolvedValue(null as never);

            await expect(service.reset(token, newPassword))
                .rejects.toThrow("Falha ao recuperar conta");

            expect(enviarEmail).not.toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando o token for inválido", async () => {
            vi.mocked(jwt.verify).mockImplementation(() => {
                throw new Error("Token inválido");
            });

            await expect(service.reset(token, newPassword))
                .rejects.toThrow("Erro ao redefinir senha");

            expect(repo.reset).not.toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando o envio do email falhar", async () => {
            vi.mocked(repo.reset).mockResolvedValue(
                userDatabaseMock as never
            );

            vi.mocked(enviarEmail).mockRejectedValue(
                new Error("Falha no SMTP")
            );

            await expect(service.reset(token, newPassword))
                .rejects.toThrow("Erro ao redefinir senha");

            expect(repo.reset).toHaveBeenCalled();
        });

        it("deve retornar erro 500 quando ocorrer uma falha inesperada no repository", async () => {
            vi.mocked(repo.reset).mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(service.reset(token, newPassword))
                .rejects.toThrow("Erro ao redefinir senha");
        });
    });


    describe("me", () => {
        const authPayload = {
            id: "user-123"
        } as AuthPayload;

        it("deve retornar os dados do usuário autenticado", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            const result = await service.me(authPayload);

            expect(result).toEqual({
                user_id: "user-123",
                user_username: "jonas",
                user_email: "jonas@email.com",
                role_name: "USER",
                permissions: ["CREATE_ROOM", "JOIN_ROOM"]
            });

            expect(repo.findUser).toHaveBeenCalledWith(
                undefined,
                undefined,
                "user-123"
            );
        });

        it("não deve retornar a senha do usuário", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(userMock);

            const result = await service.me(authPayload);

            expect(result).not.toHaveProperty("user_password");
        });

        it("deve retornar erro 401 quando o usuário não existir", async () => {
            vi.mocked(repo.findUser).mockResolvedValue(null);

            await expect(service.me(authPayload))
                .rejects.toThrow("Usuário não encontrado");
        });

        it("deve retornar erro 500 quando ocorrer uma falha inesperada", async () => {
            vi.mocked(repo.findUser).mockRejectedValue(
                new Error("Erro no banco")
            );

            await expect(service.me(authPayload))
                .rejects.toThrow("Erro ao buscar usuário");
        });
    });
});