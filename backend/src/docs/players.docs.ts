
export const playerDocs = {
    "/player/{roomCode}/podium": {
        get: {
            summary: "Buscar pódio da sala",
            description: "Retorna a classificação dos jogadores da sala.",
            tags: ["Player"],
            parameters: [
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Código da sala.",
                    example: "ABC123"
                }
            ],
            responses: {
                200: {
                    description: "Pódio retornado com sucesso"
                },
                404: {
                    description: "Sala não encontrada"
                },
                429: {
                    description: "Limite de requisições excedido"
                },
                500: {
                    description: "Erro interno do servidor"
                }
            }
        }
    },

    "/player/{playerId}/{roomCode}/ready": {
        patch: {
            summary: "Atualizar status de prontidão",
            description: "Atualiza o status de pronto ou não pronto de um jogador na sala.",
            tags: ["Player"],
            parameters: [
                {
                    in: "path",
                    name: "playerId",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Identificador do jogador."
                },
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Código da sala.",
                    example: "ABC123"
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["ready"],
                            properties: {
                                ready: {
                                    type: "boolean",
                                    example: true
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Status do jogador atualizado com sucesso"
                },
                400: {
                    description: "Não foi possível atualizar o status"
                },
                404: {
                    description: "Sala ou jogador não encontrado"
                },
                429: {
                    description: "Limite de requisições excedido"
                },
                500: {
                    description: "Erro interno do servidor"
                }
            }
        }
    },

    "/player/{roomCode}/{playerId}/{powerId}/powerup": {
        post: {
            summary: "Utilizar power-up",
            description: "Executa um power-up para um jogador dentro de uma sala.",
            tags: ["Player"],
            parameters: [
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Código da sala.",
                    example: "ABC123"
                },
                {
                    in: "path",
                    name: "playerId",
                    required: true,
                    schema: {
                        type: "string"
                    },
                    description: "Identificador do jogador."
                },
                {
                    in: "path",
                    name: "powerId",
                    required: true,
                    schema: {
                        type: "integer"
                    },
                    description: "Identificador do power-up.",
                    example: 1
                }
            ],
            responses: {
                200: {
                    description: "Power-up utilizado com sucesso"
                },
                400: {
                    description: "Não foi possível utilizar o power-up"
                },
                404: {
                    description: "Sala, jogador ou power-up não encontrado"
                },
                429: {
                    description: "Limite de requisições excedido"
                },
                500: {
                    description: "Erro interno do servidor"
                }
            }
        }
    }
};
