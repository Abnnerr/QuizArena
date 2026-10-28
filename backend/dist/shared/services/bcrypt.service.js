import bcrypt from 'bcrypt';
export class BcryptService {
    async hash(password) {
        return bcrypt.hash(password, 10);
    }
    async compare(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
//# sourceMappingURL=bcrypt.service.js.map