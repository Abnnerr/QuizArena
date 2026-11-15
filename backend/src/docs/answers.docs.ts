
export const answerDocs = {
    "/answer/{roomCode}/createAnswer": {
        post: {
            summary: "Enviar resposta",
            description: "Registra a resposta de um jogador para uma rodada de uma sala.",
            tags: ["Answer"],

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

            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["roundId", "playerId", "alternativeId"],
                            properties: {
                                roundId: {
                                    type: "integer",
                                    description: "Identificador da rodada.",
                                    example: 1
                                },
                                playerId: {
                                    type: "string",
                                    description: "Identificador do jogador.",
                                    example: "550e8400-e29b-41d4-a716-446655440000"
                                },
                                alternativeId: {
                                    type: "integer",
                                    description: "Identificador da alternativa escolhida.",
                                    example: 10
                                }
                            }
                        }
                    }
                }
            },

            responses: {
                200: {
                    description: "Resposta registrada com sucesso"
                },
                400: {
                    description: "Dados inválidos ou resposta não permitida"
                },
                404: {
                    description: "Sala, rodada, jogador ou alternativa não encontrada"
                },
                409: {
                    description: "Jogador já respondeu essa rodada"
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