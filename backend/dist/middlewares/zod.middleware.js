import { HttpResponse } from "../shared/response/httpResponse.js";
export class ZodMiddleware {
    static validate(schema, target) {
        return (req, res, next) => {
            if (target === 'body') {
                const verify = schema.safeParse(req.body);
                if (!verify.success) {
                    return HttpResponse.warning(res, 400, 'Dados invalidos', verify.error.format());
                }
                req.body = verify.data;
            }
            if (target === 'params') {
                const verify = schema.safeParse(req.params);
                if (!verify.success) {
                    return HttpResponse.warning(res, 400, 'Dados invalidos', verify.error.format());
                }
                req.validatedParams = verify.data;
            }
            next();
        };
    }
}
//# sourceMappingURL=zod.middleware.js.map