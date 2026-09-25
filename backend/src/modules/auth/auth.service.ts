import { AppError } from "../../error/AppError.js";
import type { AuthRepository } from "./auth.repository.js";
import type { RegisterDTO } from "./schema/register.schema.js";

export class AuthService {
    constructor(private readonly repo: AuthRepository) { }

    async register(dados: RegisterDTO): Promise<void> {
        try {
            await this.repo.register(dados)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao registrar usuario')
        }
    }
}