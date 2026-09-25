import type { Prisma } from "@prisma/client";



export interface TokenDTO  {
    token: string
}

export interface LoginResponse {
    user: {
        role_name: string;
        permissions: string[];
        user_id: string;
        user_username: string;
        user_email: string;
    }
    token: string
}


export type UserWithRole = Prisma.UsersGetPayload<{
    include: {
        Role: {
            include: {
                rolePermissions: {
                    include: {
                        permission: true;
                    };
                };
            };
        };
    };
}>;