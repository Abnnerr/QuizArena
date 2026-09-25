import type { NextFunction, Request, Response } from "express";
import { HttpResponse } from "../shared/response/httpResponse.js";
import type { ZodSchema } from "zod";

export class ZodMiddleware {
    static validate<T>(schema: ZodSchema<T>, target: 'body' | 'params') {
        return (req: Request, res: Response, next: NextFunction) => {
            if (target === 'body') {
                const verify = schema.safeParse(req.body)

                if (!verify.success) {
                    return HttpResponse.warning(res, 400, 'Dados invalidos', verify.error.format())
                }
                req.body = verify.data
            }
            if (target === 'params') {
                const verify = schema.safeParse(req.params)

                if (!verify.success) {
                    return HttpResponse.warning(res, 400, 'Dados invalidos', verify.error.format())
                }
                req.validatedParams = verify.data
            }
            next()
        }
    }
}