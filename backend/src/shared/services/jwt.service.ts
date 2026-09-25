import type { AuthPayload } from "../../types/generic.js";
import jwt, { type SignOptions } from 'jsonwebtoken'

export class JwtService {
    sign(dados: AuthPayload, tempo: string) {
        return jwt.sign({ id: dados.id, role: dados.role }, process.env.SEGREDO!, { expiresIn: tempo as NonNullable<SignOptions["expiresIn"]> })
    }
    verify(token: string) {
        return jwt.verify(token, process.env.SEGREDO!)
    }
}