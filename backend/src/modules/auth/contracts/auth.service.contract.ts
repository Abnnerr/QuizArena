import type { Users } from "@prisma/client";

import type { LoginDTO } from "../schema/login.schema.js";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { LoginResponse } from "../dto/auth.dto.js";

export interface IAuthService {
    register: (dados: RegisterDTO) => Promise<void>
    login: (dados: LoginDTO) => Promise<LoginResponse>
    forgot: (email: string) => Promise<void>
    reset: (token: string, password: string) => Promise<void>
}