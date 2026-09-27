import type { Users } from "@prisma/client";
import type { RegisterDTO } from "../schema/register.schema.js";
import type { UserWithRole } from "../dto/auth.dto.js";

export type IAuthRepository = {
    register: (dados: RegisterDTO) => Promise<Users>
    findUser: (email?: string, id?: string) => Promise<UserWithRole>
    reset: (id: string, password: string) => Promise<Users>
}