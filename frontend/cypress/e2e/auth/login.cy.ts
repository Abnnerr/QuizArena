
describe("Auth - Login", () => {
    const selectors = {
        page: '[data-cy="login-page"]',
        form: '[data-cy="login-form"]',
        username: '[data-cy="login-username"] input',
        password: '[data-cy="login-password"] input',
        submit: '[data-cy="login-submit-container"] button',
        feedback: '[data-cy="login-feedback"]',
        toggle: '[data-cy="password-toggle"]',
    };

    const fillLogin = (user = "jonas", pass = "Senha123!") => {
        cy.get(selectors.username).type(user);
        cy.get(selectors.password).type(pass);
    };

    beforeEach(() => {
        cy.intercept("GET", "**/auth/me", {
            statusCode: 200,
            body: { type: "Warning", message: "Não autenticado." },
        }).as("checkSession");

        cy.visit("/auth/login");
        cy.get(selectors.page, { timeout: 15000 }).should("be.visible");
        cy.get(selectors.form).should("be.visible");
    });

    it("AUTH-01 - Deve renderizar a página", () => {
        cy.location("pathname").should("eq", "/auth/login");
        [selectors.username, selectors.password, selectors.submit]
            .forEach((selector) => cy.get(selector).should("be.visible"));
    });

    it("AUTH-02 - Deve desabilitar o botão com campos vazios", () => {
        cy.get(selectors.submit).should("be.disabled");
    });

    it("AUTH-03 - Deve preencher o usuário", () => {
        cy.get(selectors.username).type("jonas").should("have.value", "jonas");
    });

    it("AUTH-04 - Deve preencher a senha", () => {
        cy.get(selectors.password).type("Senha123!").should("have.value", "Senha123!");
    });

    it("AUTH-05 - Deve alternar a visibilidade da senha", () => {
        cy.get(selectors.password).type("Senha123!").should("have.attr", "type", "password");
        cy.get(selectors.toggle).click();
        cy.get(selectors.password).should("have.attr", "type", "text");
        cy.get(selectors.toggle).click();
        cy.get(selectors.password).should("have.attr", "type", "password");
    });

    it("AUTH-06 - Deve informar credenciais inválidas", () => {
        cy.intercept("POST", "**/auth/login", {
            statusCode: 200,
            body: { type: "Warning", message: "Usuário ou senha incorretos." },
        }).as("login");

        fillLogin("usuario_invalido", "senha_invalida");
        cy.get(selectors.submit).click();
        cy.wait("@login");
        cy.get(selectors.feedback).should("contain", "Usuário ou senha incorretos.");
    });

    it("AUTH-07 - Deve autenticar e redirecionar", () => {
        cy.intercept("POST", "**/auth/login", {
            statusCode: 200,
            body: {
                type: "Success",
                message: "Login realizado com sucesso.",
                data: { user: { user_id: "user-test-id", user_username: "jonas" } },
            },
        }).as("login");

        fillLogin();
        cy.get(selectors.submit).click();
        cy.wait("@login");
        cy.location("pathname").should("eq", "/");
    });

    it("AUTH-08 - Deve informar erro do servidor", () => {
        cy.intercept("POST", "**/auth/login", {
            statusCode: 500,
            body: { message: "Erro interno do servidor." },
        }).as("login");

        fillLogin();
        cy.get(selectors.submit).click();
        cy.wait("@login");
        cy.get(selectors.feedback).should("contain", "Erro interno do servidor.");
    });

    it("AUTH-09 - Deve acessar a recuperação de senha", () => {
        cy.contains("a", "Esqueceu a senha?").click();
        cy.location("pathname").should("eq", "/auth/forgot-password");
    });
});
