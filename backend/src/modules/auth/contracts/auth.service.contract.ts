
import type { LoginDTO } from "../schema/login.schema.js";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { LoginResponse, UserResponse } from "../dto/auth.dto.js";
import type { AuthPayload } from "../../../types/generic.js";

export type IAuthService = {
    register: (dados: RegisterDTO) => Promise<void>
    login: (dados: LoginDTO) => Promise<LoginResponse>
    forgot: (email: string) => Promise<void>
    reset: (token: string, password: string) => Promise<void>
    me: (user: AuthPayload) => Promise<UserResponse>
}