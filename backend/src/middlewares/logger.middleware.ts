
import { logger } from '../observability/logger.js';
import { pinoHttp } from 'pino-http';

export const loggerMiddleware = pinoHttp({
    logger,

    serializers: {
        req(req) {
            return {
                id: req.id,
                method: req.method,
                url: req.url,
            };
        },

        res(res) {
            return {
                statusCode: res.statusCode,
            };
        },
    },

    customLogLevel(_req, res, err) {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
    },

    customSuccessMessage(req, res) {
        return `${req.method} ${req.url} - ${res.statusCode}`;
    },

    customErrorMessage(req, res, err) {
        return `${req.method} ${req.url} - ${res.statusCode}: ${err.message}`;
    },
});
