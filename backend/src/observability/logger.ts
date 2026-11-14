import pino from "pino";
const transport = pino.transport({
    targets: [
        {
            target: 'pino-opentelemetry-transport',
            options: {
                resourceAttributes: {
                    'service.name': 'quiz-arena',
                },
                logRecordProcessorOptions: {
                    exporterOptions: {
                        protocol: 'http/protobuf',
                        url: 'https://api.honeycomb.io/v1/logs',
                        headers: {
                            'x-honeycomb-team': process.env["HONEYCOMB_API_KEY"],
                        },
                    },
                },
            },
        },
        {
            target: 'pino/file',
            options: { destination: 1 },
        },

    ],
});

export const logger = pino(
    {
        redact: {
            paths: [
                "req.headers.cookie",
                "req.headers.authorization",
                "res.headers.set-cookie",
            ],
            censor: "[REDACTED]",
        },
    },
    transport
);
