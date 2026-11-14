
import { logger } from '../observability/logger.js';
import { pinoHttp } from 'pino-http';

export const loggerMiddleware = pinoHttp({
    logger,

    customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';

        return 'info';
    },

    customProps: (req) => ({
        context: 'HTTP',
        requestId: req.id
    }),

    autoLogging: true
});
