
describe("Auth - Register", () => {
    const selectors = {
        page: '[data-cy="register-page"]',
        form: '[data-cy="register-form"]',
        username: '[data-cy="register-username"] input',
        email: '[data-cy="register-email"] input',
        password: '[data-cy="register-password"] input',
        requirements: '[data-cy="register-password-requirements"]',
        submit: '[data-cy="register-submit-container"] button',
        feedback: '[data-cy="register-feedback"]',
        login: '[data-cy="register-login-prompt"]',
    };

    const fillRegister = (
        user = "jonas",
        email = "jonas@email.com",
        password = "Senha123!"
    ) => {
        cy.get(selectors.username).type(user);
        cy.get(selectors.email).type(email);
        cy.get(selectors.password).type(password);
    };
    beforeEach(() => {
        cy.intercept("GET", "**/api/auth/me", {
            statusCode: 200,
            body: { type: "Warning", message: "Não autenticado." },
        }).as("checkSession");

        cy.visit("/auth/register");
        cy.get(selectors.page, { timeout: 15000 }).should("be.visible");
        cy.get(selectors.form).should("be.visible");
    });

    it("AUTH-10 - Deve renderizar a página", () => {
        cy.location("pathname").should("eq", "/auth/register");
        [selectors.username, selectors.email, selectors.password, selectors.submit]
            .forEach((selector) => cy.get(selector).should("be.visible"));
    });

    it("AUTH-11 - Deve desabilitar o botão com campos vazios", () => {
        cy.get(selectors.submit).should("be.disabled");
    });

    it("AUTH-12 - Deve preencher os campos", () => {
        fillRegister();

        cy.get(selectors.username).should("have.value", "jonas");
        cy.get(selectors.email).should("have.value", "jonas@email.com");
        cy.get(selectors.password).should("have.value", "Senha123!");
        cy.get(selectors.submit).should("be.enabled");
    });

    it("AUTH-13 - Deve validar os requisitos da senha", () => {
        cy.get(selectors.password).type("abc");

        ["8+ caracteres", "Letra maiúscula", "Letra minúscula", "Número (0-9)", "Caractere especial"]
            .forEach((requirement) =>
                cy.get(selectors.requirements).should("contain", requirement)
            );
    });

    it("AUTH-14 - Deve informar usuário já cadastrado", () => {
        cy.intercept("POST", "**/auth/register", {
            statusCode: 200,
            body: { type: "Warning", message: "Usuário já cadastrado." },
        }).as("registerExists");

        fillRegister();
        cy.get(selectors.submit).click();
        cy.wait("@registerExists");
        cy.get(selectors.feedback).should("contain", "Usuário já cadastrado.");
    });

    it("AUTH-15 - Deve cadastrar com sucesso", () => {
        cy.intercept("POST", "**/auth/register", {
            statusCode: 201,
            body: { type: "Success", message: "Cadastro realizado com sucesso." },
        }).as("registerSuccess");

        fillRegister();
        cy.get(selectors.submit).click();
        cy.wait("@registerSuccess");
    });

    it("AUTH-16 - Deve informar erro do servidor", () => {
        cy.intercept("POST", "**/auth/register", {
            statusCode: 500,
            body: { message: "Erro interno do servidor." },
        }).as("registerError");

        fillRegister();
        cy.get(selectors.submit).click();
        cy.wait("@registerError");
        cy.get(selectors.feedback).should("contain", "Erro interno do servidor.");
    });

    it("AUTH-17 - Deve voltar para o login", () => {
        cy.get(selectors.login).contains("a", /entrar|login/i).click();
        cy.location("pathname").should("eq", "/auth/login");
    });
});
