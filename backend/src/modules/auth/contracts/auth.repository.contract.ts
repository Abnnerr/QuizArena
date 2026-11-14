import type { Users } from "@prisma/client";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { UserWithRole } from "../dto/auth.dto.js";

export type IAuthRepository = {
    register: (dados: RegisterDTO) => Promise<Users>
    findUser: (userName?: string, email?: string, id?: string) => Promise<UserWithRole | null>
    reset: (id: string, password: string) => Promise<Users>
}