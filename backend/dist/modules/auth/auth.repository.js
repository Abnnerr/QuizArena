import { prisma } from "../../db/index.js";
export class AuthRepository {
    async register(dados) {
        try {
            return await prisma.users.create({
                data: {
                    user_email: dados.email,
                    user_username: dados.userName,
                    user_password: dados.password,
                    role_id: 2
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findUser(userName, email, id) {
        try {
            const where = userName ? { user_username: userName } : email ? { user_email: email } : { user_id: id };
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
        }
        catch (error) {
            throw error;
        }
    }
    async reset(id, password) {
        try {
            return await prisma.users.update({
                where: {
                    user_id: id
                },
                data: {
                    user_password: password
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
}
//# sourceMappingURL=auth.repository.js.map