
import request from "supertest";
import {
    describe,
    it,
    expect,
    beforeAll,
    beforeEach,
    afterAll
} from "vitest";

import app from "../../../app/app.js";
import { prisma } from "../../../db/index.js";

describe("Integração - Answer", () => {
    const uniqueId = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const userName = `host_${uniqueId}`;
    const email = `host_${uniqueId}@email.com`;
    const password = "Teste@123";

    const playerName = `player_${uniqueId}`;
    const roomCode = `ROOM${Date.now()}`;

    let userId: string;
    let playerId: string;
    let roomId: number;
    let questionId: number;
    let alternativeCorrectId: number;
    let alternativeIncorrectId: number;
    let activeRoundId: number;

    beforeAll(async () => {
        await request(app)
            .post("/api/auth/register")
            .send({
                userName,
                email,
                password
            });

        const user = await prisma.users.findUnique({
            where: { user_email: email }
        });

        if (!user) {
            throw new Error("Não foi possível criar o usuário de teste.");
        }

        userId = user.user_id;
        const player = await prisma.players.create({
            data: {
                player_name: playerName
            }
        });

        playerId = player.player_id;

        // Cria a sala.
        const room = await prisma.rooms.create({
            data: {
                room_code: roomCode,
                host_user_id: userId,
                room_name: `Sala ${uniqueId}`,
                max_players: 10,
                time_limit: 20,
                room_mode: "NORMAL",
                room_status: "LIVE",
                position: 1
            }
        });

        roomId = room.room_id;

        // Vincula o jogador à sala.
        await prisma.roomPlayer.create({
            data: {
                room_id: roomId,
                player_id: playerId,
                score: 0,
                ready: true
            }
        });

        const question = await prisma.questions.create({
            data: {
                question_text: `Pergunta de teste ${uniqueId}`,
                active: true
            }
        });

        questionId = question.question_id;

        const correctAlternative = await prisma.alternatives.create({
            data: {
                alternative_text: "Alternativa correta",
                is_correct: true,
                question_id: questionId
            }
        });

        const incorrectAlternative = await prisma.alternatives.create({
            data: {
                alternative_text: "Alternativa incorreta",
                is_correct: false,
                question_id: questionId
            }
        });

        alternativeCorrectId = correctAlternative.alternative_id;
        alternativeIncorrectId = incorrectAlternative.alternative_id;
    });

    beforeEach(async () => {
        const roomExists = await prisma.rooms.findUnique({
            where: {
                room_id: roomId
            }
        });

        if (!roomExists) {
            throw new Error(
                `Sala de teste ${roomId} não existe antes da criação da rodada.`
            );
        }
        await prisma.round.updateMany({
            where: {
                room_id: roomId,
                closed_at: null
            },
            data: {
                closed_at: new Date()
            }
        });

        await prisma.roomPlayer.update({
            where: {
                room_id_player_id: {
                    room_id: roomId,
                    player_id: playerId
                }
            },
            data: {
                score: 0
            }
        });
        const round = await prisma.round.create({
            data: {
                room_id: roomId,
                question_id: questionId,
                opened_at: new Date(Date.now() - 1000)
            }
        });

        activeRoundId = round.round_id;
    });

    afterAll(async () => {
        if (!roomId && !questionId && !playerId && !userId) {
            await prisma.$disconnect();
            return;
        }

        const rounds = await prisma.round.findMany({
            where: {
                OR: [
                    ...(roomId ? [{ room_id: roomId }] : []),
                    ...(questionId ? [{ question_id: questionId }] : [])
                ]
            },
            select: {
                round_id: true
            }
        });

        const roundIds = rounds.map(round => round.round_id);

        const alternatives = questionId
            ? await prisma.alternatives.findMany({
                where: {
                    question_id: questionId
                },
                select: {
                    alternative_id: true
                }
            })
            : [];

        const alternativeIds = alternatives.map(
            alternative => alternative.alternative_id
        );

   
        await prisma.answers.deleteMany({
            where: {
                OR: [
                    ...(roundIds.length > 0
                        ? [{ round_id: { in: roundIds } }]
                        : []),
                    ...(alternativeIds.length > 0
                        ? [{ alternative_id: { in: alternativeIds } }]
                        : [])
                ]
            }
        });

        if (roomId) {
            await prisma.powerUpUse.deleteMany({
                where: {
                    room_id: roomId
                }
            });
        }


        if (roundIds.length > 0) {
            await prisma.round.deleteMany({
                where: {
                    round_id: { in: roundIds }
                }
            });
        }

        if (roomId) {
            await prisma.roomQuestion.deleteMany({
                where: {
                    room_id: roomId
                }
            });

            await prisma.roomPlayer.deleteMany({
                where: {
                    room_id: roomId
                }
            });
        }

        if (alternativeIds.length > 0) {
            await prisma.alternatives.deleteMany({
                where: {
                    alternative_id: { in: alternativeIds }
                }
            });
        }

        // Remove questão.
        if (questionId) {
            await prisma.questions.deleteMany({
                where: {
                    question_id: questionId
                }
            });
        }
        if (roomId) {
            await prisma.rooms.deleteMany({
                where: {
                    room_id: roomId
                }
            });
        }

    
        if (playerId) {
            await prisma.players.deleteMany({
                where: {
                    player_id: playerId
                }
            });
        }

        if (userId) {
            await prisma.users.deleteMany({
                where: {
                    user_id: userId
                }
            });
        }

    });

    describe("POST /api/answer/:roomCode/createAnswer", () => {
        it("deve registrar uma resposta correta e atualizar a pontuação", async () => {
            const response = await request(app)
                .post(`/api/answer/${roomCode}/createAnswer`)
                .send({
                    roundId: activeRoundId,
                    playerId,
                    alternativeId: alternativeCorrectId
                });

            expect(response.status).toBe(201);

            const answer = await prisma.answers.findFirst({
                where: {
                    round_id: activeRoundId,
                    player_id: playerId
                }
            });

            expect(answer).not.toBeNull();
            expect(answer?.alternative_id).toBe(alternativeCorrectId);
            expect(answer?.points).toBeGreaterThan(0);

            const roomPlayer = await prisma.roomPlayer.findFirst({
                where: {
                    room_id: roomId,
                    player_id: playerId
                }
            });

            expect(roomPlayer?.score).toBe(answer?.points);
        });

        it("deve registrar uma resposta incorreta sem pontuação no modo NORMAL", async () => {
            const response = await request(app)
                .post(`/api/answer/${roomCode}/createAnswer`)
                .send({
                    roundId: activeRoundId,
                    playerId,
                    alternativeId: alternativeIncorrectId
                });

            expect(response.status).toBe(201);

            const answer = await prisma.answers.findFirst({
                where: {
                    round_id: activeRoundId,
                    player_id: playerId
                }
            });

            expect(answer).not.toBeNull();
            expect(answer?.alternative_id).toBe(alternativeIncorrectId);
            expect(answer?.points).toBe(0);

            const roomPlayer = await prisma.roomPlayer.findFirst({
                where: {
                    room_id: roomId,
                    player_id: playerId
                }
            });

            expect(roomPlayer?.score).toBe(0);
        });

        it("deve rejeitar uma alternativa inexistente", async () => {
            const response = await request(app)
                .post(`/api/answer/${roomCode}/createAnswer`)
                .send({
                    roundId: activeRoundId,
                    playerId,
                    alternativeId: 999999
                });

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Alternativa não encontrada");

            const answer = await prisma.answers.findFirst({
                where: {
                    round_id: activeRoundId,
                    player_id: playerId
                }
            });

            expect(answer).toBeNull();
        });

        it("deve rejeitar dados inválidos", async () => {
            const response = await request(app)
                .post(`/api/answer/${roomCode}/createAnswer`)
                .send({
                    roundId: "não é um número",
                    playerId: 123,
                    alternativeId: "inválido"
                });

            expect(response.status).toBe(400);
        });
    });
});
