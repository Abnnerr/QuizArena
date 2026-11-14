
import { logger } from "../../observability/logger.js";

export class Logger {
    private static log(
        level: "trace" | "debug" | "info" | "warn" | "error" | "fatal",
        context: string,
        action: string,
        data?: unknown,
        error?: unknown,
        duration?: number
    ) {
        logger[level]({
            context,
            action,
            ...(data !== undefined && { data }),
            ...(error !== undefined && { err: error }),
            ...(duration !== undefined && { duration_ms: duration })
        }, action);
    }

    static trace(context: string, action: string, data?: unknown, duration?: number) {
        this.log("trace", context, action, data, undefined, duration);
    }

    static debug(context: string, action: string, data?: unknown, duration?: number) {
        this.log("debug", context, action, data, undefined, duration);
    }

    static info(context: string, action: string, data?: unknown, duration?: number) {
        this.log("info", context, action, data, undefined, duration);
    }

    static warn(context: string, action: string, data?: unknown, duration?: number) {
        this.log("warn", context, action, data, undefined, duration);
    }

    static error(context: string, action: string, error?: unknown, data?: unknown, duration?: number) {
        this.log("error", context, action, data, error, duration);
    }

    static fatal(context: string, action: string, error?: unknown, data?: unknown, duration?: number) {
        this.log("fatal", context, action, data, error, duration);
    }
}
