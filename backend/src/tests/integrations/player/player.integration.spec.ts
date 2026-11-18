import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import { Server } from "socket.io";

import app from "../../../app/app.js";
import { prisma } from "../../../db/index.js";
import { configureSocketService } from "../../../shared/services/socket.service.js";

describe("Player Integration Tests", () => {
    let socketServer: Server;

    let roomCode: string;
    let playerId: string;
    let userId: string;
    let roomId: number;

    beforeAll(async () => {
        socketServer = new Server();
        configureSocketService(socketServer);

        // Cria um usuário pela rota de registro
        const registerResponse = await request(app)
            .post("/api/auth/register")
            .send({
                userName: `player_test_${Date.now()}`,
                email: `player_test_${Date.now()}@test.com`,
                password: "Test@123456",
            });

        expect(registerResponse.status).toBe(201);

        // Busca o usuário criado
        const user = await prisma.users.findFirst({
            where: {
                user_email: registerResponse.body.data?.email,
            },
        });

        // Se sua resposta não retorna o email dentro de data,
        // ajuste a busca para utilizar o email enviado no registro.
        expect(user).not.toBeNull();

        userId = user!.user_id;

        // Cria um player
        const player = await prisma.players.create({
            data: {
                player_name: `player_${Date.now()}`,
            },
        });

        playerId = player.player_id;

        // Cria uma sala
        const room = await prisma.rooms.create({
            data: {
                room_code: `TEST${Date.now()}`,
                host_user_id: userId,
                room_name: "Sala de teste",
                max_players: 10,
                time_limit: 30,
                room_mode: "NORMAL",
                room_status: "LIVE",
                position: 0,
            },
        });

        roomCode = room.room_code;
        roomId = room.room_id;

        // Vincula o player à sala
        await prisma.roomPlayer.create({
            data: {
                room_id: roomId,
                player_id: playerId,
                score: 0,
                ready: false,
            },
        });
    });

    afterAll(async () => {
        const rooms = await prisma.rooms.findMany({
            where: {
                host_user_id: userId,
            },
            select: {
                room_id: true,
            },
        });

        const roomIds = rooms.map((room) => room.room_id);

        const rounds = await prisma.round.findMany({
            where: {
                room_id: {
                    in: roomIds,
                },
            },
            select: {
                round_id: true,
            },
        });

        const roundIds = rounds.map((round) => round.round_id);

        if (roundIds.length > 0) {
            await prisma.answers.deleteMany({
                where: {
                    round_id: {
                        in: roundIds,
                    },
                },
            });
        }

        if (roomIds.length > 0) {
            await prisma.powerUpUse.deleteMany({
                where: {
                    room_id: {
                        in: roomIds,
                    },
                },
            });
        }

        if (roundIds.length > 0) {
            await prisma.round.deleteMany({
                where: {
                    round_id: {
                        in: roundIds,
                    },
                },
            });
        }

        if (roomIds.length > 0) {
            await prisma.roomPlayer.deleteMany({
                where: {
                    room_id: {
                        in: roomIds,
                    },
                },
            });

            await prisma.roomQuestion.deleteMany({
                where: {
                    room_id: {
                        in: roomIds,
                    },
                },
            });

            await prisma.rooms.deleteMany({
                where: {
                    room_id: {
                        in: roomIds,
                    },
                },
            });
        }

        if (playerId) {
            await prisma.players.deleteMany({
                where: {
                    player_id: playerId,
                },
            });
        }

        if (userId) {
            await prisma.users.deleteMany({
                where: {
                    user_id: userId,
                },
            });
        }
    });
    describe("GET /api/player/:roomCode/podium", () => {
        it("deve retornar o pódio da sala", async () => {
            const response = await request(app)
                .get(`/api/player/${roomCode}/podium`);

            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
        });

        it("deve retornar 404 quando a sala não existir", async () => {
            const response = await request(app)
                .get("/api/player/INVALID999/podium");

            expect(response.status).toBe(404);
        });
    });

    describe("PATCH /api/player/:playerId/:roomCode/ready", () => {
        it("deve marcar o player como pronto", async () => {
            const response = await request(app)
                .patch(`/api/player/${playerId}/${roomCode}/ready`)
                .send({
                    ready: true,
                });

            expect(response.status).toBe(200);

            const player = await prisma.roomPlayer.findFirst({
                where: {
                    room_id: roomId,
                    player_id: playerId,
                },
            });

            expect(player?.ready).toBe(true);
        });

        it("deve marcar o player como não pronto", async () => {
            const response = await request(app)
                .patch(`/api/player/${playerId}/${roomCode}/ready`)
                .send({
                    ready: false,
                });

            expect(response.status).toBe(200);

            const player = await prisma.roomPlayer.findFirst({
                where: {
                    room_id: roomId,
                    player_id: playerId,
                },
            });

            expect(player?.ready).toBe(false);
        });

        it("deve retornar 400 quando o body for inválido", async () => {
            const response = await request(app)
                .patch(`/api/player/${playerId}/${roomCode}/ready`)
                .send({
                    ready: "sim",
                });

            expect(response.status).toBe(400);
        });
    });

    describe("POST /api/player/:roomCode/:playerId/:powerId/:userName/powerup", () => {
        it("deve retornar 404 quando o power-up não existir", async () => {
            const response = await request(app)
                .post(
                    `/api/player/${roomCode}/${playerId}/999999/TestPlayer/powerup`,
                );

            expect(response.status).toBe(404);
            expect(response.body.message).toBe("PowerUp não encontrado");
        });
    });
});