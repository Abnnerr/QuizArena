import type { $Enums, Prisma } from "@prisma/client";



export type TokenDTO = {
    token: string
}

export type LoginResponse = {
    user: {
        role_name: string;
        permissions: string[];
        user_id: string;
        user_username: string;
        user_email: string;
    }
    token: string
}

export type UserResponse = {
    role_name: $Enums.Roles;
    permissions: string[];
    user_id: string;
    user_email: string;
    user_username: string;

}

export type UserWithRole = Prisma.UsersGetPayload<{
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
}>;