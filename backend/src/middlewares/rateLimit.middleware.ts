import type { NextFunction, Request, Response } from "express"
import { HttpResponse } from "../shared/response/httpResponse.js";

const clients = new Map<string, { count: number, reset: number }>()


setInterval(() => {
    const now = Date.now();

    for (const [ip, client] of clients) {
        if (now >= client.reset) {
            clients.delete(ip);
        }
    }
}, 60_000);

export class RateLimit {
    static limit(limit: number, tempo: number) {
        return (req: Request, res: Response, next: NextFunction) => {
            const ip = req.ip ?? ''
            const now = Date.now()
            
            if (process.env["NODE_MODE"] !== 'production') {
                const client = clients.get(ip)

                if (!client || now >= client.reset) {
                    clients.set(ip, {
                        count: 1,
                        reset: now + tempo * 60 * 1000
                    })
                    return next()
                }

                if (client.count > limit) {
                    const retryAfter = Math.ceil(
                        (client.reset - now) / 1000
                    );
                    res.setHeader("Retry-After", retryAfter);
                    return HttpResponse.warning(res, 429, "Muitas Requisicoes", retryAfter);
                }
                client.count++
                return next()
            }
        }
    }
}