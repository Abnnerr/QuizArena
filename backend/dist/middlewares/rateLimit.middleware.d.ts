import type { NextFunction, Request, Response } from "express";
export declare class RateLimit {
    static limit(limit: number, tempo: number): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
}
//# sourceMappingURL=rateLimit.middleware.d.ts.map