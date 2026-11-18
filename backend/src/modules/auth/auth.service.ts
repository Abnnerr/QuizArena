import { AppError } from "../../error/AppError.js";
import type { BcryptService } from "../../shared/services/bcrypt.service.js";
import type { JwtService } from "../../shared/services/jwt.service.js";
import type { LoginDTO } from "./schema/login.schema.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { LoginResponse, ProfilePayload, UserResponse } from "./dto/auth.dto.js";
import type { AuthDomain } from "./domain/auth.domain.js";
import { enviarEmail } from "../../shared/utils/email.js";
import { html } from "./templates/auth.templates.js";
import type { AuthPayload } from "../../types/generic.js";
import { measure } from "../../observability/measure.js";
import { Logger } from "../../shared/services/logger.service.js";
import type { IAuthRepository } from "./contracts/auth.repository.contract.js";

export class AuthService {
    constructor(
        private readonly repo: IAuthRepository,
        private readonly jwt: JwtService,
        private readonly bcrypt: BcryptService,
        private readonly domain: AuthDomain
    ) { }

    async register(dados: RegisterDTO): Promise<void> {
        return measure("AuthService.register", async () => {
            try {
                this.domain.ensureRegister(dados);
                this.domain.ensurePassword(dados.password);

                const password = await this.bcrypt.hash(dados.password);

                const newDados: RegisterDTO = {
                    ...dados,
                    password
                };

                const result = await this.repo.register(newDados);

                if (!result) {
                    Logger.warn("AuthService", "register.conflict");
                    throw new AppError(409, "Não foi possível realizar o cadastro, email já cadastrado");
                }

                try {
                    await enviarEmail(
                        result.user_email,
                        "Seja bem-vindo",
                        html.register(
                            result.user_username,
                            "http://localhost:9000/auth/login"
                        )
                    );
                } catch (error) {
                    Logger.warn("AuthService", "register.email_failed", {
                        userId: result.user_id,
                        error: error instanceof Error ? error.message : String(error)
                    });
                }

                Logger.info("AuthService", "register.completed", {
                    userId: result.user_id
                });

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("AuthService", "register.failed", error);
                throw new AppError(500, "Erro ao registrar usuário");
            }
        });
    }

    async login(dados: LoginDTO): Promise<LoginResponse> {
        return measure("AuthService.login", async () => {
            try {
                const result = await this.repo.findUser(dados.userName);

                if (!result) {
                    Logger.warn("AuthService", "login.user_not_found");
                    throw new AppError(401, "E-mail ou senha inválidos");
                }

                const compare = await this.bcrypt.compare(
                    dados.password,
                    result.user_password
                );

                if (!compare) {
                    Logger.warn("AuthService", "login.invalid_password", {
                        userId: result.user_id
                    });

                    throw new AppError(401, "E-mail ou senha inválidos");
                }

                const { user_password: _, Role: __, ...rest } = result;

                const permissions = result.Role.rolePermissions.map(
                    item => item.permission.permission_name
                );

                const user: UserResponse = {
                    ...rest,
                    role_name: result.Role.role_name,
                    permissions
                };

                const token = this.jwt.sign(
                    result.user_id,
                    result.Role.role_name,
                    permissions,
                    "3h"
                );

                Logger.info("AuthService", "login.completed", {
                    userId: result.user_id
                });

                return {
                    user,
                    token
                };

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("AuthService", "login.failed", error);
                throw new AppError(500, "Erro ao realizar login");
            }
        });
    }

    async forgot(email: string): Promise<void> {
        return measure("AuthService.forgot", async () => {
            try {
                const result = await this.repo.findUser(undefined, email);

                if (!result) {
                    Logger.warn("AuthService", "forgot.user_not_found");
                    throw new AppError(404, "Usuário não encontrado");
                }

                const token = this.jwt.sign(
                    result.user_id,
                    result.Role.role_name,
                    [],
                    "10m"
                );

                try {
                    await enviarEmail(
                        result.user_email,
                        "Recuperar conta",
                        html.forgot(
                            result.user_username,
                            `http://localhost:5173/auth/reset-password/${token}`
                        )
                    );
                } catch (error) {
                    Logger.warn("AuthService", "forgot.email_failed", {
                        userId: result.user_id,
                        error: error instanceof Error ? error.message : String(error)
                    });
                }

                Logger.info("AuthService", "forgot.completed", {
                    userId: result.user_id
                });

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("AuthService", "forgot.failed", error);
                throw new AppError(500, "Erro ao recuperar conta");
            }
        });
    }

    async reset(token: string, password: string): Promise<void> {
        return measure("AuthService.reset", async () => {
            try {
                this.domain.ensurePassword(password);

                const id = this.jwt.verify(token).id;
                const hash = await this.bcrypt.hash(password);

                const result = await this.repo.reset(id, hash);

                if (!result) {
                    Logger.warn("AuthService", "reset.user_not_found", {
                        userId: id
                    });

                    throw new AppError(400, "Falha ao recuperar conta");
                }

                try {
                    await enviarEmail(
                        result.user_email,
                        "Senha alterada",
                        html.reset(result.user_username)
                    );
                } catch (error) {
                    Logger.error("AuthService", "reset.email_failed", error, {
                        userId: id
                    });

                    throw error;
                }

                Logger.info("AuthService", "reset.completed", {
                    userId: id
                });

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("AuthService", "reset.failed", error);
                throw new AppError(500, "Erro ao redefinir senha");
            }
        });
    }

    async me(user: AuthPayload): Promise<UserResponse> {
        return measure("AuthService.me", async () => {
            try {
                const result = await this.repo.findUser(
                    undefined,
                    undefined,
                    user.id
                );

                if (!result) {
                    Logger.warn("AuthService", "me.user_not_found", {
                        userId: user.id
                    });

                    throw new AppError(401, "Usuário não encontrado");
                }

                const { user_password: _, Role: __, ...rest } = result;

                const userLimpo: UserResponse = {
                    ...rest,
                    role_name: result.Role.role_name,
                    permissions: result.Role.rolePermissions.map(
                        item => item.permission.permission_name
                    )
                };

                return userLimpo;

            } catch (error) {
                if (error instanceof AppError) throw error;

                Logger.error("AuthService", "me.failed", error, {
                    userId: user.id
                });

                throw new AppError(500, "Erro ao buscar usuário");
            }
        });
    }
    async profile(user: AuthPayload): Promise<ProfilePayload> {
        try {
            const result = await this.repo.profile(user.id)

            if (!result) {
                throw new AppError(404, "usuario nao encontrado")
            }

            return result
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao buscar dados do usuario')
        }
    }
}
