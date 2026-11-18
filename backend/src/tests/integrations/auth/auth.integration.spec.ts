
import request from "supertest";
import { randomUUID } from "node:crypto";
import {
    afterAll,
    beforeAll,
    describe,
    expect,
    it,
} from "vitest";

import app from "../../../app/app.js";
import { prisma } from "../../../db/index.js";

interface TestAccount {
    userName: string;
    email: string;
    password: string;
}

const createdUsernames: string[] = [];

function createAccountData(): TestAccount {
    const id = randomUUID().replaceAll("-", "");

    return {
        userName: `user_${id}`,
        email: `test_${id}@email.com`,
        password: "Teste@123",
    };
}

async function createAccount(): Promise<TestAccount> {
    const account = createAccountData();

    createdUsernames.push(account.userName);

    const response = await request(app)
        .post("/api/auth/register")
        .send(account);

    expect(response.status).toBe(201);

    return account;
}

async function loginAccount(account: TestAccount) {
    return request(app)
        .post("/api/auth/login")
        .send({
            userName: account.userName,
            password: account.password,
        });
}

function extractAccessCookie(response: {
    headers: {
        "set-cookie"?: string[];
    };
}): string {
    const cookies = response.headers["set-cookie"];

    const cookie = cookies?.find((value) =>
        value.startsWith("access_token=")
    );

    expect(cookie).toBeDefined();

    return cookie!.split(";")[0]!;
}

describe("Integração - Auth", () => {

    beforeAll(async () => {
        await prisma.role.upsert({
            where: {
                role_id: 2,
            },
            update: {
                role_name: "user",
            },
            create: {
                role_id: 2,
                role_name: "user",
            },
        });
    });

    afterAll(async () => {
        if (createdUsernames.length > 0) {
            await prisma.users.deleteMany({
                where: {
                    user_username: {
                        in: createdUsernames,
                    },
                },
            });
        }

        await prisma.$disconnect();
    });


    describe("POST /api/auth/register", () => {

        it("deve cadastrar um usuário com sucesso", async () => {
            const account = createAccountData();

            createdUsernames.push(account.userName);

            const response = await request(app)
                .post("/api/auth/register")
                .send(account);

            expect(response.status).toBe(201);

            expect(response.body.message).toBe(
                "Olhe sua caixa de Emails"
            );

            const user = await prisma.users.findUnique({
                where: {
                    user_username: account.userName,
                },
            });

            expect(user).not.toBeNull();
            expect(user?.user_email).toBe(account.email);
            expect(user?.user_password).not.toBe(account.password);
        });

    });

    describe("POST /api/auth/login", () => {

        it("deve autenticar um usuário com sucesso", async () => {
            const account = await createAccount();

            const response = await loginAccount(account);

            expect(response.status).toBe(200);

            expect(response.body.message).toBe("Usuario logado");

            expect(response.headers["set-cookie"]).toBeDefined();

            const cookie = extractAccessCookie(response);

            expect(cookie).toContain("access_token=");
        });

        it("não deve autenticar com senha incorreta", async () => {
            const account = await createAccount();

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    userName: account.userName,
                    password: "SenhaErrada@123",
                });

            expect(response.status).toBe(401);
        });

        it("não deve autenticar um usuário inexistente", async () => {
            const account = createAccountData();

            const response = await request(app)
                .post("/api/auth/login")
                .send({
                    userName: account.userName,
                    password: account.password,
                });

            expect(response.status).toBe(401);
        });

    });

    describe("POST /api/auth/forgot-password", () => {

        it("deve solicitar recuperação de senha", async () => {
            const account = await createAccount();

            const response = await request(app)
                .post("/api/auth/forgot-password")
                .send({
                    email: account.email,
                });

            expect(response.status).toBe(200);

            expect(response.body.message).toBe(
                "Usuario registrado"
            );
        });

        it("não deve solicitar recuperação para email inexistente", async () => {
            const account = createAccountData();

            const response = await request(app)
                .post("/api/auth/forgot-password")
                .send({
                    email: account.email,
                });

            expect(response.status).toBe(404);
        });

    });

    describe("POST /api/auth/reset-password/:token", () => {

        it("deve redefinir a senha com um token válido", async () => {
            const account = await createAccount();

            const loginResponse = await loginAccount(account);

            expect(loginResponse.status).toBe(200);

            const cookie = extractAccessCookie(loginResponse);

            const token = decodeURIComponent(
                cookie.slice("access_token=".length)
            );

            const newPassword = "NovaSenha@123";

            const response = await request(app)
                .post(`/api/auth/reset-password/${token}`)
                .send({
                    password: newPassword,
                });

            expect(response.status).toBe(200);

            expect(response.body.message).toBe(
                "Conta recuperada"
            );

            const newLoginResponse = await request(app)
                .post("/api/auth/login")
                .send({
                    userName: account.userName,
                    password: newPassword,
                });

            expect(newLoginResponse.status).toBe(200);
        });

    });

    describe("GET /api/auth/me", () => {

        it("deve retornar os dados do usuário autenticado", async () => {
            const account = await createAccount();

            const loginResponse = await loginAccount(account);

            expect(loginResponse.status).toBe(200);

            const cookie = extractAccessCookie(loginResponse);

            const response = await request(app)
                .get("/api/auth/me")
                .set("Cookie", cookie);

            expect(response.status).toBe(200);

            expect(response.body.message).toBe(
                "usuario encontrado"
            );
        });

        it("não deve permitir acesso sem autenticação", async () => {
            const response = await request(app)
                .get("/api/auth/me");

            expect(response.status).toBe(401);
        });

    });

});
