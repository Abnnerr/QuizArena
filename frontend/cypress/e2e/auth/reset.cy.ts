
describe("Auth - Reset Password", () => {
    const selectors = {
        page: '[data-cy="reset-page"]',
        form: '[data-cy="reset-form"]',
        password: '[data-cy="reset-form"] input',
        requirements: '[data-cy="reset-password-requirements"]',
        submit: '[data-cy="reset-form"] button[type="submit"]',
        feedback: '[data-cy="reset-feedback"]',
        login: '[data-cy="reset-login-prompt"]',
    };

    const fillReset = (password = "NovaSenha123!") => {
        cy.get(selectors.password).eq(0).type(password);
        cy.get(selectors.password).eq(1).type(password);
    };

    beforeEach(() => {
        cy.intercept("GET", "**/api/auth/me", {
            statusCode: 200,
            body: { type: "Warning", message: "Não autenticado." },
        }).as("checkSession");

        cy.visit("/auth/reset-password/token-teste");
        cy.get(selectors.page, { timeout: 15000 }).should("be.visible");
        cy.get(selectors.form).should("be.visible");
    });

    it("AUTH-25 - Deve renderizar a página", () => {
        cy.location("pathname").should("eq", "/auth/reset-password/token-teste");
        cy.get(selectors.password).should("have.length", 2);
        cy.get(selectors.submit).should("be.visible");
    });

    it("AUTH-26 - Deve preencher as senhas", () => {
        fillReset();

        cy.get(selectors.password).eq(0).should("have.value", "NovaSenha123!");
        cy.get(selectors.password).eq(1).should("have.value", "NovaSenha123!");
    });

    it("AUTH-27 - Deve exibir os requisitos da senha", () => {
        cy.get(selectors.password).eq(0).type("abc");

        [
            "8+ caracteres",
            "Letra maiúscula",
            "Letra minúscula",
            "Número (0-9)",
            "Caractere especial",
        ].forEach((requirement) => {
            cy.get(selectors.requirements).should("contain", requirement);
        });
    });

    it("AUTH-28 - Deve redefinir a senha com sucesso", () => {
        cy.intercept("POST", "**/api/auth/reset-password/*", {
            statusCode: 200,
            body: {
                type: "Success",
                message: "Senha redefinida com sucesso.",
            },
        }).as("resetSuccess");

        fillReset();
        cy.get(selectors.submit).click();
        cy.wait("@resetSuccess");
    });

    it("AUTH-29 - Deve informar erro ao redefinir a senha", () => {
        cy.intercept("POST", "**/api/auth/reset-password/*", {
            statusCode: 500,
            body: { message: "Erro interno do servidor." },
        }).as("resetError");

        fillReset();
        cy.get(selectors.submit).click();
        cy.wait("@resetError");
        cy.get(selectors.feedback).should("contain", "Erro interno do servidor.");
    });

    it("AUTH-30 - Deve voltar para o login", () => {
        cy.get(selectors.login).contains("a", /entrar|login/i).click();
        cy.location("pathname").should("eq", "/auth/login");
    });
});
