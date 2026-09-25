import type { Users } from "@prisma/client";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { UserWithRole } from "../dto/auth.dto.js";

export interface IAuthRepository {
    register: (dados: RegisterDTO) => Promise<Users>
    login: (email?: string, id?: string) => Promise<UserWithRole>
    reset: (id: string, password: string) => Promise<Users>
}