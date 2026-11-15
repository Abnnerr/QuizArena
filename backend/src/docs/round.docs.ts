export const roundDocs = {
    "/round/{roomCode}/{playerId}/findRound": {
        get: {
            summary: "Buscar rodada em aberto para um jogador",
            tags: ["Round"],
            parameters: [
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: { type: "string" }
                },
                {
                    in: "path",
                    name: "playerId",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Rodada encontrada"
                },
                404: {
                    description: "Rodada não encontrada"
                },
                429: {
                    description: "Limite de requisições excedido"
                }
            }
        }
    },

    "/round/{roomCode}/findRound": {
        get: {
            summary: "Buscar rodada em aberto",
            tags: ["Round"],
            parameters: [
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            responses: {
                200: {
                    description: "Rodada encontrada"
                },
                404: {
                    description: "Rodada não encontrada"
                },
                429: {
                    description: "Limite de requisições excedido"
                }
            }
        }
    },

    "/round/{roomCode}/roundFinished": {
        post: {
            summary: "Finalizar rodada e iniciar uma nova",
            tags: ["Round"],
            security: [{ bearerAuth: [] }],
            parameters: [
                {
                    in: "path",
                    name: "roomCode",
                    required: true,
                    schema: { type: "string" }
                }
            ],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["round_id"],
                            properties: {
                                round_id: {
                                    type: "number",
                                    example: 1
                                }
                            }
                        }
                    }
                }
            },
            responses: {
                200: {
                    description: "Rodada finalizada e próxima rodada criada"
                },
                400: {
                    description: "Dados inválidos"
                },
                401: {
                    description: "Não autenticado"
                },
                403: {
                    description: "Sem permissão para finalizar a rodada"
                },
                404: {
                    description: "Sala ou rodada não encontrada"
                },
                429: {
                    description: "Limite de requisições excedido"
                }
            }
        }
    }
};