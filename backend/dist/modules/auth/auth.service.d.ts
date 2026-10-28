import type { BcryptService } from "../../shared/services/bcrypt.service.js";
import type { JwtService } from "../../shared/services/jwt.service.js";
import type { AuthRepository } from "./auth.repository.js";
import type { LoginDTO } from "./schema/login.schema.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { LoginResponse, UserResponse } from "./dto/auth.dto.js";
import type { AuthDomain } from "./domain/auth.domain.js";
import type { AuthPayload } from "../../types/generic.js";
export declare class AuthService {
    private readonly repo;
    private readonly jwt;
    private readonly bcrypt;
    private readonly domain;
    constructor(repo: AuthRepository, jwt: JwtService, bcrypt: BcryptService, domain: AuthDomain);
    register(dados: RegisterDTO): Promise<void>;
    login(dados: LoginDTO): Promise<LoginResponse>;
    forgot(email: string): Promise<void>;
    reset(token: string, password: string): Promise<void>;
    me(user: AuthPayload): Promise<UserResponse>;
}
//# sourceMappingURL=auth.service.d.ts.map