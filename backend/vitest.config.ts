import { defineConfig } from "vitest/config";

process.env["RESEND_API_KEY"] = "re_test_fake_key_for_tests";

export default defineConfig({
    test: {
        environment: "node",
        globals: true,

        setupFiles: ["./src/tests/setup.ts"],

        include: [
            "src/**/*.test.ts",
            "src/**/*.spec.ts",
        ],

        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
        },
    },
});