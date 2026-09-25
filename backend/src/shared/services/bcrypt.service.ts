import bcrypt from 'bcrypt'

export class BcryptService {
    async hash(senha: string): Promise<string> {
        return bcrypt.hash(senha, 10)
    }
    async compare(senha: string, hash: string): Promise<boolean> {
        return bcrypt.compare(senha, hash)
    }
}