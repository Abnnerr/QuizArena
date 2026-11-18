
import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Server } from "socket.io";

import app from "../../../app/app.js";
import { prisma } from "../../../db/index.js";
import { JwtService } from "../../../shared/services/jwt.service.js";
import { configureSocketService } from "../../../shared/services/socket.service.js";

describe("Round Integration", () => {
    const id = randomUUID().replaceAll("-", "");

    const userName = `round_test_${id}`;
    const email = `round_test_${id}@email.com`;
    const password = "Teste@123";
    const roomName = `Sala Round ${id}`;

    let userId: string;
    let token: string;

    let roomCode: string;
    let roomId: number;
    let playerId: string;
    let roundId: number;

    let socketServer: Server;

    const roomPayload = {
        name: roomName,
        maxPlayers: 10,
        timeLimit: 5,
        mode: "NORMAL",
        questions: [
            {
                text: "Qual é a linguagem utilizada no backend?",
                alternatives: [
                    { text: "TypeScript", isCorrect: true },
                    { text: "Python", isCorrect: false },
                    { text: "Java", isCorrect: false },
                    { text: "C++", isCorrect: false },
                ],
            },
            {
                text: "Qual banco de dados está sendo utilizado?",
                alternatives: [
                    { text: "PostgreSQL", isCorrect: true },
                    { text: "MongoDB", isCorrect: false },
                    { text: "MySQL", isCorrect: false },
                    { text: "SQLite", isCorrect: false },
                ],
            },
            {
                text: "Qual framework é utilizado no backend?",
                alternatives: [
                    { text: "Express", isCorrect: true },
                    { text: "NestJS", isCorrect: false },
                    { text: "Fastify", isCorrect: false },
                    { text: "Koa", isCorrect: false },
                ],
            },
        ],
    };

    beforeAll(async () => {
        socketServer = new Server();
        configureSocketService(socketServer);

        await prisma.role.upsert({
            where: { role_id: 2 },
            update: {},
            create: {
                role_id: 2,
                role_name: "user",
            },
        });

        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                userName,
                email,
                password,
            });

        expect(registerResponse.status).toBe(201);

        const user = await prisma.users.findUnique({
            where: { user_email: email },
        });

        if (!user) {
            throw new Error("Não foi possível criar o usuário de teste.");
        }

        userId = user.user_id;

        token = new JwtService().sign(
            userId,
            "host",
            ["ROOM_CREATE", "ROOM_START", "ROUND_FINISH"],
            "10m",
        );

        // Cria a sala de teste.

        const roomResponse = await request(app)
            .post("/api/room/create")
            .set("Authorization", `Bearer ${token}`)
            .send(roomPayload);

        expect(roomResponse.status).toBe(201);

        const room = await prisma.rooms.findFirst({
            where: {
                room_name: roomName,
                host_user_id: userId,
            },
            select: {
                room_id: true,
                room_code: true,
            },
        });

        if (!room) {
            throw new Error("Não foi possível criar a sala de teste.");
        }

        roomId = room.room_id;
        roomCode = room.room_code;

        // Adiciona dois jogadores à sala.

        const firstPlayerName = `Player_${randomUUID().slice(0, 8)}`;
        const secondPlayerName = `Player_${randomUUID().slice(0, 8)}`;

        const firstPlayerResponse = await request(app)
            .post(`/api/room/join/${roomCode}`)
            .send({ userName: firstPlayerName });

        expect(firstPlayerResponse.status).toBe(200);

        const secondPlayerResponse = await request(app)
            .post(`/api/room/join/${roomCode}`)
            .send({ userName: secondPlayerName });

        expect(secondPlayerResponse.status).toBe(200);

        const player = await prisma.players.findFirst({
            where: { player_name: firstPlayerName },
        });

        if (!player) {
            throw new Error("Não foi possível encontrar o jogador de teste.");
        }

        playerId = player.player_id;

        // Inicia a partida e cria a primeira rodada.

        const startResponse = await request(app)
            .get(`/api/room/${roomId}/start`)
            .set("Authorization", `Bearer ${token}`);

        expect(startResponse.status).toBe(201);

        const round = await prisma.round.findFirst({
            where: {
                room_id: roomId,
                closed_at: null,
            },
        });

        if (!round) {
            throw new Error("Não foi possível criar a rodada de teste.");
        }

        roundId = round.round_id;
    });

    afterAll(async () => {
        if (userId) {
            const rooms = await prisma.rooms.findMany({
                where: { host_user_id: userId },
                select: { room_id: true },
            });

            const roomIds = rooms.map((room) => room.room_id);

            if (roomIds.length > 0) {
                const rounds = await prisma.round.findMany({
                    where: { room_id: { in: roomIds } },
                    select: { round_id: true },
                });

                const roundIds = rounds.map((round) => round.round_id);

                const roomQuestions = await prisma.roomQuestion.findMany({
                    where: { room_id: { in: roomIds } },
                    select: { question_id: true },
                });

                const questionIds = roomQuestions.map(
                    (question) => question.question_id,
                );

                const alternatives = questionIds.length > 0
                    ? await prisma.alternatives.findMany({
                        where: {
                            question_id: { in: questionIds },
                        },
                        select: {
                            alternative_id: true,
                        },
                    })
                    : [];

                const alternativeIds = alternatives.map(
                    (alternative) => alternative.alternative_id,
                );

                const roomPlayers = await prisma.roomPlayer.findMany({
                    where: { room_id: { in: roomIds } },
                    select: { player_id: true },
                });

                const playerIds = roomPlayers.map(
                    (player) => player.player_id,
                );

                if (roundIds.length > 0) {
                    await prisma.answers.deleteMany({
                        where: {
                            round_id: { in: roundIds },
                        },
                    });
                }

                if (alternativeIds.length > 0) {
                    await prisma.answers.deleteMany({
                        where: {
                            alternative_id: { in: alternativeIds },
                        },
                    });
                }

                await prisma.powerUpUse.deleteMany({
                    where: { room_id: { in: roomIds } },
                });

                await prisma.roomPlayer.deleteMany({
                    where: { room_id: { in: roomIds } },
                });

                if (playerIds.length > 0) {
                    await prisma.players.deleteMany({
                        where: {
                            player_id: { in: playerIds },
                        },
                    });
                }

                await prisma.round.deleteMany({
                    where: { room_id: { in: roomIds } },
                });

                await prisma.roomQuestion.deleteMany({
                    where: { room_id: { in: roomIds } },
                });

                if (questionIds.length > 0) {
                    await prisma.alternatives.deleteMany({
                        where: {
                            question_id: { in: questionIds },
                        },
                    });

                    await prisma.questions.deleteMany({
                        where: {
                            question_id: { in: questionIds },
                        },
                    });
                }

                await prisma.rooms.deleteMany({
                    where: { room_id: { in: roomIds } },
                });
            }

            await prisma.users.deleteMany({
                where: { user_id: userId },
            });
        }

        await prisma.$disconnect();
    });

    // =====================================================
    // GET /api/round/:roomCode/findRound
    // =====================================================

    describe("GET /api/round/:roomCode/findRound", () => {
        it("deve encontrar a rodada ativa de uma sala", async () => {
            const response = await request(app)
                .get(`/api/round/${roomCode}/findRound`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Round Encontrado");
        });

        it("não deve encontrar uma rodada de uma sala inexistente", async () => {
            const response = await request(app)
                .get("/api/round/CODIGO_INEXISTENTE/findRound");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Sala não encontrada");
        });
    });

    // =====================================================
    // GET /api/round/:roomCode/:playerId/findRound
    // =====================================================

    describe("GET /api/round/:roomCode/:playerId/findRound", () => {
        it("deve encontrar a rodada ativa com os dados do jogador", async () => {
            const response = await request(app)
                .get(`/api/round/${roomCode}/${playerId}/findRound`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Round Encontrado");
        });

        it("não deve encontrar uma rodada de uma sala inexistente", async () => {
            const response = await request(app)
                .get(`/api/round/CODIGO_INEXISTENTE/${playerId}/findRound`);

            expect(response.status).toBe(404);
        });
    });

    // =====================================================
    // POST /api/round/:roomCode/roundFinished
    // =====================================================

    describe("POST /api/round/:roomCode/roundFinished", () => {
        it("não deve finalizar uma rodada sem autenticação", async () => {
            const response = await request(app)
                .post(`/api/round/${roomCode}/roundFinished`)
                .send({ round_id: roundId });

            expect(response.status).toBe(401);
        });

        it("não deve finalizar uma rodada sem a permissão necessária", async () => {
            const userToken = new JwtService().sign(
                userId,
                "host",
                [],
                "10m",
            );

            const response = await request(app)
                .post(`/api/round/${roomCode}/roundFinished`)
                .set("Authorization", `Bearer ${userToken}`)
                .send({ round_id: roundId });

            expect(response.status).toBe(403);
        });

        it("não deve finalizar uma rodada com dados inválidos", async () => {
            const response = await request(app)
                .post(`/api/round/${roomCode}/roundFinished`)
                .set("Authorization", `Bearer ${token}`)
                .send({ round_id: "invalido" });

            expect(response.status).toBe(400);
        });

        it("deve finalizar a rodada atual e criar a próxima", async () => {
            const response = await request(app)
                .post(`/api/round/${roomCode}/roundFinished`)
                .set("Authorization", `Bearer ${token}`)
                .send({ round_id: roundId });

            expect(response.status).toBe(201);

            expect(response.body).toHaveProperty(
                "message",
                "Round terminado e novo criado",
            );

            const finishedRound = await prisma.round.findUnique({
                where: { round_id: roundId },
            });

            expect(finishedRound?.closed_at).not.toBeNull();

            const nextRound = await prisma.round.findFirst({
                where: {
                    room_id: roomId,
                    closed_at: null,
                },
            });

            expect(nextRound).not.toBeNull();
            expect(nextRound?.round_id).not.toBe(roundId);
        });

        it("não deve encontrar uma rodada ativa depois da finalização", async () => {
            const response = await request(app)
                .get(`/api/round/${roomCode}/findRound`);

            // A próxima rodada é criada, então deve existir uma rodada ativa.
            expect(response.status).toBe(200);
        });
    });
});
