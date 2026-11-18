
import { randomUUID } from "node:crypto";
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import { Server } from "socket.io";

import app from "../../../app/app.js";
import { prisma } from "../../../db/index.js";
import { JwtService } from "../../../shared/services/jwt.service.js";
import { configureSocketService } from "../../../shared/services/socket.service.js";

describe("Room Integration", () => {
    const id = randomUUID().replaceAll("-", "");

    const userName = `room_test_${id}`;
    const email = `room_test_${id}@email.com`;
    const password = "Teste@123";

    let userId: string;
    let token: string;
    let roomCode: string;
    let roomId: number;

    let socketServer: Server;

    const roomName = `Sala Teste ${id}`;

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
            ["ROOM_CREATE", "ROOM_START", "ROOM_DELETE"],
            "10m",
        );
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
    // POST /api/room/create
    // =====================================================

    describe("POST /api/room/create", () => {
        it("deve criar uma sala com dados válidos", async () => {
            const response = await request(app)
                .post("/api/room/create")
                .set("Authorization", `Bearer ${token}`)
                .send(roomPayload);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Sala criada");

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

            expect(room).not.toBeNull();

            roomCode = room!.room_code;
            roomId = room!.room_id;
        });

        it("não deve permitir criar uma sala com nome duplicado", async () => {
            const response = await request(app)
                .post("/api/room/create")
                .set("Authorization", `Bearer ${token}`)
                .send(roomPayload);

            expect(response.status).toBe(409);
        });

        it("não deve criar uma sala com dados inválidos", async () => {
            const response = await request(app)
                .post("/api/room/create")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    ...roomPayload,
                    maxPlayers: 1,
                });

            expect(response.status).toBe(400);
        });

        it("não deve permitir criar uma sala sem autenticação", async () => {
            const response = await request(app)
                .post("/api/room/create")
                .send(roomPayload);

            expect(response.status).toBe(401);
        });

        it("não deve permitir criar uma sala sem a permissão necessária", async () => {
            const userToken = new JwtService().sign(
                userId,
                "user",
                [],
                "10m",
            );

            const response = await request(app)
                .post("/api/room/create")
                .set("Authorization", `Bearer ${userToken}`)
                .send({
                    ...roomPayload,
                    name: `${roomName} sem permissão`,
                });

            expect(response.status).toBe(403);
        });
    });

    // =====================================================
    // POST /api/room/join/:name
    // =====================================================

    describe("POST /api/room/join/:name", () => {
        it("deve permitir que um jogador entre em uma sala existente", async () => {
            const playerName = `Player_${randomUUID().slice(0, 8)}`;

            const response = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({
                    userName: playerName,
                });

            expect(response.status).toBe(200);

            const player = await prisma.players.findFirst({
                where: {
                    player_name: playerName,
                },
            });

            expect(player).not.toBeNull();

            const membership = await prisma.roomPlayer.findUnique({
                where: {
                    room_id_player_id: {
                        room_id: roomId,
                        player_id: player!.player_id,
                    },
                },
            });

            expect(membership).not.toBeNull();
        });

        it("não deve permitir a entrada de um jogador com nome duplicado", async () => {
            const playerName = `Duplicate_${randomUUID().slice(0, 8)}`;

            const firstResponse = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({ userName: playerName });

            expect(firstResponse.status).toBe(200);

            const secondResponse = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({ userName: playerName });

            expect(secondResponse.status).not.toBe(200);
        });

        it("não deve permitir entrada em uma sala inexistente", async () => {
            const response = await request(app)
                .post("/api/room/join/CODIGO_INEXISTENTE")
                .send({
                    userName: `Player_${randomUUID().slice(0, 8)}`,
                });

            expect(response.status).toBe(404);
        });

        it("não deve permitir entrada quando a sala não estiver aberta", async () => {
            await prisma.rooms.update({
                where: { room_id: roomId },
                data: { room_status: "LIVE" },
            });

            const response = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({
                    userName: `Player_${randomUUID().slice(0, 8)}`,
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("A sala não está aberta");

            await prisma.rooms.update({
                where: { room_id: roomId },
                data: { room_status: "LOBBY" },
            });
        });

        it("não deve permitir entrada quando a sala estiver cheia", async () => {
            await prisma.rooms.update({
                where: { room_id: roomId },
                data: { max_players: 1 },
            });

            const response = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({
                    userName: `Player_${randomUUID().slice(0, 8)}`,
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe("Sala está cheia");

            await prisma.rooms.update({
                where: { room_id: roomId },
                data: { max_players: 10 },
            });
        });

        it("não deve permitir entrada com nome inválido", async () => {
            const response = await request(app)
                .post(`/api/room/join/${roomCode}`)
                .send({
                    userName: "A",
                });

            expect(response.status).toBe(400);
        });
    });

    // =====================================================
    // GET /api/room/:name
    // =====================================================

    describe("GET /api/room/:name", () => {
        it("deve encontrar uma sala existente pelo código", async () => {
            const response = await request(app)
                .get(`/api/room/${roomCode}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Sala encontrada");

            const room = await prisma.rooms.findUnique({
                where: { room_code: roomCode },
            });

            expect(room).not.toBeNull();
        });

        it("não deve encontrar uma sala inexistente", async () => {
            const response = await request(app)
                .get("/api/room/CODIGO_INEXISTENTE");

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("Sala não encontrada");
        });
    });

    // =====================================================
    // GET /api/room/:id/start
    // =====================================================

    describe("GET /api/room/:id/start", () => {
        it("não deve iniciar uma partida sem autenticação", async () => {
            const response = await request(app)
                .get(`/api/room/${roomId}/start`);

            expect(response.status).toBe(401);
        });

        it("não deve iniciar uma partida sem a permissão necessária", async () => {
            const userToken = new JwtService().sign(
                userId,
                "host",
                [],
                "10m",
            );

            const response = await request(app)
                .get(`/api/room/${roomId}/start`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });

        it("não deve iniciar uma sala inexistente", async () => {
            const response = await request(app)
                .get("/api/room/999999999/start")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it("deve iniciar uma partida com jogadores suficientes", async () => {
            const response = await request(app)
                .get(`/api/room/${roomId}/start`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(201);

            const room = await prisma.rooms.findUnique({
                where: { room_id: roomId },
            });

            expect(room?.room_status).toBe("LIVE");

            const round = await prisma.round.findFirst({
                where: { room_id: roomId },
            });

            expect(round).not.toBeNull();
        });
    });

    // =====================================================
    // DELETE /api/room/:roomCode/:roundId/limpar
    // =====================================================

    describe("DELETE /api/room/:roomCode/:roundId/limpar", () => {
        it("não deve limpar uma sala sem autenticação", async () => {
            const response = await request(app)
                .delete(`/api/room/${roomCode}/1/limpar`);

            expect(response.status).toBe(401);
        });

        it("não deve limpar uma sala sem a permissão necessária", async () => {
            const userToken = new JwtService().sign(
                userId,
                "host",
                [],
                "10m",
            );

            const response = await request(app)
                .delete(`/api/room/${roomCode}/1/limpar`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(response.status).toBe(403);
        });

        it("não deve limpar uma sala inexistente", async () => {
            const response = await request(app)
                .delete("/api/room/CODIGO_INEXISTENTE/1/limpar")
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(404);
        });

        it("deve limpar uma sala existente", async () => {
            const round = await prisma.round.findFirst({
                where: { room_id: roomId },
                select: { round_id: true },
            });

            expect(round).not.toBeNull();

            const response = await request(app)
                .delete(`/api/room/${roomCode}/${round!.round_id}/limpar`)
                .set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Sala limpa");

            const room = await prisma.rooms.findUnique({
                where: { room_id: roomId },
            });

            expect(room?.room_status).toBe("LOBBY");
            expect(room?.position).toBe(0);

            const playersCount = await prisma.roomPlayer.count({
                where: { room_id: roomId },
            });

            expect(playersCount).toBe(0);

            const roundsCount = await prisma.round.count({
                where: { room_id: roomId },
            });

            expect(roundsCount).toBe(0);
        });
    });
});
