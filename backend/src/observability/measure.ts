
import { performance } from "node:perf_hooks";
import { SpanStatusCode } from "@opentelemetry/api";
import { tracer } from "./tracer.js";
import { Logger } from "../shared/services/logger.service.js";


export async function measure<T>(operation: string, callback: () => Promise<T>): Promise<T> {
    return tracer.startActiveSpan(operation, async (span) => {
        const start = performance.now();

        try {
            const result = await callback();
            const duration = performance.now() - start;

            span.setAttribute("operation.duration_ms", duration);
            span.setStatus({ code: SpanStatusCode.OK });

            Logger.info(
                "Observability",
                operation,
                { status: "success" },
                Number(duration.toFixed(2))
            );

            return result;

        } catch (error) {
            const duration = performance.now() - start;

            const exception = error instanceof Error
                ? error
                : new Error(String(error));

            span.recordException(exception);
            span.setAttribute("operation.duration_ms", duration);
            span.setStatus({
                code: SpanStatusCode.ERROR,
                message: exception.message
            });

            Logger.error(
                "Observability",
                operation,
                exception,
                { status: "error" },
                Number(duration.toFixed(2))
            );

            throw error;

        } finally {
            span.end();
        }
    });
}
