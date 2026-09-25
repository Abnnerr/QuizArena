
import jwt, { type SignOptions } from 'jsonwebtoken'
import type { AuthPayload } from '../../types/generic.js'

export class JwtService {
    sign(id: string, role: string, permissions: string[], tempo: string): string {
        return jwt.sign({ id, role, permissions }, process.env.SEGREDO!, { expiresIn: tempo as NonNullable<SignOptions["expiresIn"]> })
    }
    verify(token: string): AuthPayload {
        return jwt.verify(token, process.env.SEGREDO!) as AuthPayload
    }
}