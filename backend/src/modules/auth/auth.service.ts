import type { Users } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import type { BcryptService } from "../../shared/services/bcrypt.service.js";
import type { JwtService } from "../../shared/services/jwt.service.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginDTO } from "./schema/login.schema.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { LoginResponse } from "./dto/auth.dto.js";
import type { AuthDomain } from "./domain/auth.domain.js";
import { enviarEmail } from "../../shared/utils/email.js";
import { html } from "./templates/auth.templates.js";

export class AuthService {
    constructor(
        private readonly repo: AuthRepository,
        private readonly jwt: JwtService,
        private readonly bcrypt: BcryptService,
        private readonly domain: AuthDomain

    ) { }

    async register(dados: RegisterDTO): Promise<void> {
        try {

            this.domain.ensureRegister(dados)

            const password = await this.bcrypt.hash(dados.password)

            const newDados: RegisterDTO = {
                ...dados,
                password
            }
            const result = await this.repo.register(newDados)

            if (!result) {
                throw new AppError(409, 'Não foi possível realizar o cadastro')
            }

            try {
                await enviarEmail(
                    result.user_email,
                    'Seja bem-vindo',
                    html.register(result.user_username, 'http://localhost:9000/auth/login')
                )
            } catch (error) {

            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao registrar usuario')
        }
    }
    async login(dados: LoginDTO): Promise<LoginResponse> {
        try {
            const result = await this.repo.login(dados.email)

            if (!result) {
                throw new AppError(401, 'E-mail ou senha inválidos')
            }
            const compare = await this.bcrypt.compare(dados.password, result.user_password)

            if (!compare) {
                throw new AppError(401, 'E-mail ou senha inválidos')
            }
            const { user_password: _, Role: __, role_id: ___, ...rest } = result

            const permissions = result.Role.rolePermissions.map(item => item.permission.permission_name)

            const user = {
                ...rest,
                role_name: result.Role.role_name,
                permissions
            }

            const token = this.jwt.sign(result.user_id, result.Role.role_name, permissions, '3h')

            return {
                user,
                token
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao registrar usuario')
        }
    }

    async forgot(email: string): Promise<void> {
        try {
            const result = await this.repo.login(email)

            if (!result) {
                throw new AppError(404, 'usuario nao encontrado')
            }
            const token = this.jwt.sign(result.user_id, result.Role.role_name, [], '10m')

            try {
                await enviarEmail(result.user_email,
                    'Recuperar conta',
                    html.forgot(result.user_username, `http://localhost:9000/reset-password/${token}`)
                )
            } catch (error) {

            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao registrar usuario')
        }
    }
    async reset(token: string, password: string): Promise<void> {
        try {
            
            const id = this.jwt.verify(token).id
            const hash = await this.bcrypt.hash(password)
            const result = await this.repo.reset(id, hash)
            
            if (!result) {
                throw new AppError(400, 'falha ao recupar conta')
            }

            try {
                await enviarEmail(
                    result.user_email,
                    'Senha alterada',
                    html.reset(result.user_username)
                )
            } catch (error) {
                throw error
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao registrar usuario')
        }
    }
}