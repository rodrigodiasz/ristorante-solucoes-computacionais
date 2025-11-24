/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login a user
       * @example cy.login('admin@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * Custom command to set a session cookie
       * @example cy.setSessionCookie('token123')
       */
      setSessionCookie(token: string): Chainable<void>;

      /**
       * Custom command to clear session
       * @example cy.clearSession()
       */
      clearSession(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, password: string) => {
  cy.visit("/");
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add("setSessionCookie", (token: string) => {
  cy.setCookie("session", token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
});

Cypress.Commands.add("clearSession", () => {
  cy.clearCookies();
  cy.clearLocalStorage();
});

/**
 * Custom command to check if server is running
 * @example cy.checkServer()
 */
Cypress.Commands.add("checkServer", () => {
  const baseUrl = Cypress.config().baseUrl || "http://localhost:3333";

  cy.request({
    url: baseUrl,
    failOnStatusCode: false,
    timeout: 5000,
  }).then((response) => {
    if (response.status === 0) {
      throw new Error(
        `Servidor não está rodando em ${baseUrl}. ` +
          `Por favor, execute 'npm run dev' em outro terminal antes de rodar os testes.`
      );
    }
  });
});

/**
 * Custom command to visit with server check
 * @example cy.visitWithCheck('/dashboard')
 */
Cypress.Commands.add(
  "visitWithCheck",
  (url: string, options?: Partial<Cypress.VisitOptions>) => {
    const baseUrl = Cypress.config().baseUrl || "http://localhost:3333";

    // Tenta fazer uma requisição simples para verificar se o servidor está rodando
    cy.request({
      url: baseUrl,
      failOnStatusCode: false,
      timeout: 5000,
    }).then((response) => {
      if (response.status === 0) {
        cy.log(
          '⚠️ Servidor não está rodando. Certifique-se de executar "npm run dev" antes dos testes.'
        );
        throw new Error(
          `Servidor não está acessível em ${baseUrl}. ` +
            `Execute 'npm run dev' em outro terminal e tente novamente.`
        );
      }
    });

    // Se chegou aqui, o servidor está rodando, então visita a página
    cy.visit(url, {
      failOnStatusCode: false,
      timeout: 15000,
      ...options,
    });
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to check if server is running
       * @example cy.checkServer()
       */
      checkServer(): Chainable<void>;

      /**
       * Custom command to visit with server check
       * @example cy.visitWithCheck('/dashboard')
       */
      visitWithCheck(
        url: string,
        options?: Partial<Cypress.VisitOptions>
      ): Chainable<void>;
    }
  }
}

export {};
