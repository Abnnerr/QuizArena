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
    ensurePassword(password: string) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

        if (!passwordRegex.test(password)) {
            throw new AppError(400, 'A senha deve ter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial.');
        }
    }
}