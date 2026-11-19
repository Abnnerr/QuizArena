
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        baseUrl: "http://localhost:5173",
        specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/e2e.ts",
        video: false,
        screenshotOnRunFailure: true,
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 60000,
        requestTimeout: 10000,
        responseTimeout: 30000,
        retries: {
            runMode: 1,
            openMode: 0,
        },
    },
});
