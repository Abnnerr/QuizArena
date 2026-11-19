
describe("Auth - Forgot Password", () => {
    const selectors = {
        page: '[data-cy="forgot-page"]',
        email: '[data-cy="forgot-email"] input',
        submit: '[data-cy="forgot-submit-container"] button',
        feedback: '[data-cy="forgot-feedback"]',
        login: '[data-cy="forgot-login-prompt"]',
    };

    const fillEmail = (email = "jonas@email.com") =>
        cy.get(selectors.email).type(email);

    beforeEach(() => {
        cy.intercept("GET", "**/auth/me", {
            statusCode: 200,
            body: { type: "Warning", message: "Não autenticado." },
        }).as("checkSession");

        cy.visit("/auth/forgot-password");
        cy.get(selectors.page, { timeout: 15000 }).should("be.visible");
    });

    it("AUTH-18 - Deve renderizar a página", () => {
        cy.location("pathname").should("eq", "/auth/forgot-password");
        cy.get(selectors.email).should("be.visible");
        cy.get(selectors.submit).should("be.visible");
    });

    it("AUTH-19 - Deve desabilitar o botão com e-mail vazio", () => {
        cy.get(selectors.email).should("have.value", "");
        cy.get(selectors.submit).should("be.disabled");
    });

    it("AUTH-20 - Deve preencher o e-mail", () => {
        fillEmail();
        cy.get(selectors.email).should("have.value", "jonas@email.com");
        cy.get(selectors.submit).should("be.enabled");
    });

    it("AUTH-21 - Deve enviar instruções de recuperação", () => {
        cy.intercept("POST", "**/auth/forgot-password", {
            statusCode: 200,
            body: { type: "Success", message: "Instruções enviadas com sucesso." },
        }).as("forgotSuccess");

        fillEmail();
        cy.get(selectors.submit).click();
        cy.wait("@forgotSuccess");
    });

    it("AUTH-22 - Deve informar e-mail não cadastrado", () => {
        cy.intercept("POST", "**/auth/forgot-password", {
            statusCode: 200,
            body: { type: "Warning", message: "E-mail não encontrado." },
        }).as("forgotNotFound");

        fillEmail();
        cy.get(selectors.submit).click();
        cy.wait("@forgotNotFound");
        cy.get(selectors.feedback).should("contain", "E-mail não encontrado.");
    });

    it("AUTH-23 - Deve informar erro do servidor", () => {
        cy.intercept("POST", "**/auth/forgot-password", {
            statusCode: 500,
            body: { message: "Erro interno do servidor." },
        }).as("forgotError");

        fillEmail();
        cy.get(selectors.submit).click();
        cy.wait("@forgotError");
        cy.get(selectors.feedback).should("contain", "Erro interno do servidor.");
    });

    it("AUTH-24 - Deve voltar para o login", () => {
        cy.get(selectors.login).contains("a", /entrar|login/i).click();
        cy.location("pathname").should("eq", "/auth/login");
    });
});
