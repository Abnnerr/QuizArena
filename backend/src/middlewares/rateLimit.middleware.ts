import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../shared/response/httpResponse.js";

const clients = new Map<string, { count: number; reset: number }>();

setInterval(() => {
    const now = Date.now();

    for (const [key, client] of clients) {
        if (now >= client.reset) {
            clients.delete(key);
        }
    }
}, 60_000).unref();

export class RateLimit {
    static limit(limit: number, tempo: number) {
        return (req: Request, res: Response, next: NextFunction) => {

            if (process.env["NODE_MODE"] === "develop") {
                return next();
            }

            const ip = req.ip ?? req.socket.remoteAddress ?? "unknown";

            const route = req.route?.path ?? req.path;
            const key = `${ip}:${req.method}:${req.baseUrl}${route}`;

            const now = Date.now();
            const client = clients.get(key);

            if (!client || now >= client.reset) {
                clients.set(key, {
                    count: 1,
                    reset: now + tempo * 60 * 1000
                });

                return next();
            }

            if (client.count >= limit) {
                const retryAfter = Math.ceil(
                    (client.reset - now) / 1000
                );

                res.setHeader("Retry-After", retryAfter);

                return HttpResponse.warning(
                    res,
                    429,
                    "Muitas Requisicoes",
                    retryAfter
                );
            }

            client.count++;

            return next();
        };
    }
}