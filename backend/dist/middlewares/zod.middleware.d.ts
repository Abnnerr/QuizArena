import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
export declare class ZodMiddleware {
    static validate<T>(schema: ZodSchema<T>, target: 'body' | 'params'): (req: Request, res: Response, next: NextFunction) => Response | any;
}
//# sourceMappingURL=zod.middleware.d.ts.map