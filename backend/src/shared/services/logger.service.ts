
import { logger } from "../utils/logger.js";

export class Logger {

    static trace(context: string, action: string, data?: any, duration?: number) {
        logger.trace({
            context,
            action,
            data,
            duration
        }, action);
    }

    static debug(context: string, action: string, data?: any, duration?: number) {
        logger.debug({
            context,
            action,
            data,
            duration
        }, action);
    }

    static info(context: string, action: string, data?: any, duration?: number) {
        logger.info({
            context,
            action,
            data,
            duration
        }, action);
    }

    static warn(context: string, action: string, data?: any, duration?: number) {
        logger.warn({
            context,
            action,
            data,
            duration
        }, action);
    }
    static error(context: string, action: string, error?: unknown, data?: any, duration?: number) {
        logger.error({
            context,
            action,
            err: error,
            data,
            duration
        }, action);
    }

    static fatal(context: string, action: string, error?: unknown, data?: any, duration?: number) {
        logger.fatal({
            context,
            action,
            err: error,
            data,
            duration
        }, action);
    }
}
