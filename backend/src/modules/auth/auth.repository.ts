import type { Users } from "@prisma/client";
import { prisma } from "../../db/index.js";
import type { IAuthRepository } from "./contracts/auth.repository.contract.js";
import type { RegisterDTO } from "./schema/register.schema.js";
import type { UserWithRole } from "./dto/auth.dto.js";

export class AuthRepository implements IAuthRepository {
    async register(dados: RegisterDTO): Promise<Users> {
        try {
            return await prisma.users.create({
                data: {
                    user_email: dados.email,
                    user_username: dados.userName,
                    user_password: dados.password,
                    role_id: 3
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findUser(userName?: string, email?: string, id?: string): Promise<UserWithRole> {
        try {
            const where = userName ? { user_username: userName } : email ? { user_email: email } : { user_id: id! }

            return await prisma.users.findUniqueOrThrow({
                where,
                select: {
                    user_id: true,
                    user_email: true,
                    user_username: true,
                    user_password: true,

                    Role: {
                        select: {
                            role_name: true,
                            rolePermissions: {
                                select: {
                                    permission: {
                                        select: {
                                            permission_name: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        } catch (error) {
            throw error
        }
    }
    async reset(id: string, password: string): Promise<Users> {
        try {
            return await prisma.users.update({
                where: {
                    user_id: id
                },
                data: {
                    user_password: password
                }
            })
        } catch (error) {
            throw error
        }
    }
}