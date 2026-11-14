import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { BatchLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { PinoInstrumentation } from "@opentelemetry/instrumentation-pino";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";

const apiKey = process.env["HONEYCOMB_API_KEY"];

if (!apiKey) {
    throw new Error("HONEYCOMB_API_KEY não configurada");
}

const traceExporter = new OTLPTraceExporter({
    url: "https://api.honeycomb.io/v1/traces",
    headers: {
        "x-honeycomb-team": apiKey
    }
});
const logExporter = new OTLPLogExporter({
    url: "https://api.honeycomb.io/v1/logs",
    headers: {
        "x-honeycomb-team": apiKey
    }
});
export const telemetry = new NodeSDK({
    traceExporter,

    logRecordProcessors: [
        new BatchLogRecordProcessor({
            exporter: logExporter
        })
    ],

    instrumentations: [
        getNodeAutoInstrumentations({
            "@opentelemetry/instrumentation-fs": {
                enabled: false
            },
            "@opentelemetry/instrumentation-pino": {
                enabled: false
            }
        }),

        new PinoInstrumentation({
            disableLogSending: false
        })
    ]
});