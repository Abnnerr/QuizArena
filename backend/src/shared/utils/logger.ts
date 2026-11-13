import pino from "pino";

export const logger = pino({
    level: process.env["LOG_LEVEL"] || "info",

    ...(process.env["NODE_MODE"] !== "production" && {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname"
            }
        }
    })
});