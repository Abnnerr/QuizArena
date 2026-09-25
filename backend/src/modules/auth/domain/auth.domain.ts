import { AppError } from "../../../error/AppError.js"
import type { RegisterDTO } from "../schema/register.schema.js"

export class AuthDomain {
    ensureRegister(dados: RegisterDTO) {
        if (dados.email === dados.password) {
            throw new AppError(400, 'Email e senha não podem ser iguais')
        }
        if (dados.userName === dados.password) {
            throw new AppError(400, 'userName e senha não podem ser iguais')
        }
    }
}