import type { Users } from "@prisma/client";
import type { IAuthRepository } from "./contracts/auth.repository.contract.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { UserWithRole } from "./dto/auth.dto.js";
export declare class AuthRepository implements IAuthRepository {
    register(dados: RegisterDTO): Promise<Users>;
    findUser(userName?: string, email?: string, id?: string): Promise<UserWithRole>;
    reset(id: string, password: string): Promise<Users>;
}
//# sourceMappingURL=auth.repository.d.ts.map