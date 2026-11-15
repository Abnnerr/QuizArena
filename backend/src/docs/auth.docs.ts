export const authDocs = {
    "/auth/register": {
        post: {
            summary: "Registrar novo usuário",
            description: "Cria uma nova conta de usuário.",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userName", "email", "password"],
                            properties: {
                                userName: {
                                    type: "string",
                                    minLength: 3,
                                    example: "Abnnerr"
                                },
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "usuario@email.com"
                                },
                                password: {
                                    type: "string",
                                    minLength: 8,
                                    format: "password",
                                    example: "Senha123"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: "Usuário registrado com sucesso" },
                400: { description: "Dados inválidos" },
                409: { description: "Usuário ou email já cadastrado" },
                429: { description: "Limite de requisições excedido" },
                500: { description: "Erro interno do servidor" }
            }
        }
    },

    "/auth/login": {
        post: {
            summary: "Realizar login",
            description: "Autentica um usuário utilizando nome de usuário e senha.",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["userName", "password"],
                            properties: {
                                userName: {
                                    type: "string",
                                    example: "Abnnerr"
                                },
                                password: {
                                    type: "string",
                                    format: "password",
                                    example: "Senha123"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Login realizado com sucesso" },
                400: { description: "Dados inválidos" },
                401: { description: "Credenciais inválidas" },
                429: { description: "Limite de requisições excedido" },
                500: { description: "Erro interno do servidor" }
            }
        }
    },

    "/auth/forgot-password": {
        post: {
            summary: "Solicitar recuperação de senha",
            description: "Solicita a recuperação de senha por email.",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email"],
                            properties: {
                                email: {
                                    type: "string",
                                    format: "email",
                                    example: "usuario@email.com"
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Solicitação processada com sucesso" },
                400: { description: "Email inválido" },
                404: { description: "Usuário não encontrado" },
                429: { description: "Limite de requisições excedido" },
                500: { description: "Erro interno do servidor" }
            }
        }
    },

    "/auth/reset-password/{token}": {
        post: {
            summary: "Redefinir senha",
            description: "Redefine a senha utilizando um token de recuperação.",
            tags: ["Auth"],
            parameters: [
                {
                    in: "path",
                    name: "token",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Token de recuperação de senha."
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["password"],
                            properties: {
                                password: {
                                    type: "string",
                                    minLength: 8,
                                    format: "password",
                                    pattern: "^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).+$",
                                    example: "NovaSenha123!",
                                    description: "Deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial."
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: "Senha redefinida com sucesso" },
                400: { description: "Senha inválida" },
                401: { description: "Token inválido ou expirado" },
                429: { description: "Limite de requisições excedido" },
                500: { description: "Erro interno do servidor" }
            }
        }
    },

    "/auth/me": {
        get: {
            summary: "Buscar usuário autenticado",
            description: "Retorna os dados do usuário autenticado através do JWT.",
            tags: ["Auth"],
            security: [
                {
                    bearerAuth: []
                }
            ],
            responses: {
                200: { description: "Usuário encontrado com sucesso" },
                401: { description: "Token ausente ou inválido" },
                429: { description: "Limite de requisições excedido" },
                500: { description: "Erro interno do servidor" }
            }
        }
    }
};
