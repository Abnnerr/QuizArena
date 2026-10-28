import jwt, {} from 'jsonwebtoken';
export class JwtService {
    sign(id, role, permissions, tempo) {
        return jwt.sign({ id, role, permissions }, process.env["SEGREDO"], { expiresIn: tempo });
    }
    verify(token) {
        return jwt.verify(token, process.env["SEGREDO"]);
    }
}
//# sourceMappingURL=jwt.service.js.map