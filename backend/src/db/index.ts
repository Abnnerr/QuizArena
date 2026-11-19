
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const isTest = process.env["NODE_ENV"] === "test";

dotenv.config({
    path: isTest ? ".env.test" : ".env",
    override: isTest,
});

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
    throw new Error(
        `DATABASE_URL não foi definida para o ambiente ${isTest ? "de teste" : "de desenvolvimento"}.`
    );
}

const pool = new Pool({
    connectionString: databaseUrl,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({
    adapter,
});
