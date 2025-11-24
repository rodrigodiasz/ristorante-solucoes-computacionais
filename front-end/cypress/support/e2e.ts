// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Melhora mensagens de erro para problemas de conexão
Cypress.on("fail", (error, runnable) => {
  const baseUrl = Cypress.config().baseUrl || "http://localhost:3333";

  // Não captura erros 404 quando failOnStatusCode: false está configurado
  // Verifica se é um erro de status code que pode ser ignorado
  if (
    error.message.includes("status code was not `2xx`") &&
    error.message.includes("404")
  ) {
    // Se o teste está usando failOnStatusCode: false, não deve lançar erro customizado
    // Deixa o erro original passar
    throw error;
  }

  // Melhora a mensagem de erro para ECONNREFUSED e problemas de conexão
  if (
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("connect") ||
    (error.message.includes("failed trying to load") &&
      !error.message.includes("404")) ||
    (error.name === "CypressError" &&
      error.message.includes("http request") &&
      !error.message.includes("404"))
  ) {
    const improvedError = new Error(
      `\n\n` +
        `╔══════════════════════════════════════════════════════════════╗\n` +
        `║  ❌ ERRO: Servidor não está rodando!                         ║\n` +
        `╠══════════════════════════════════════════════════════════════╣\n` +
        `║  O servidor Next.js precisa estar rodando antes dos testes. ║\n` +
        `║                                                              ║\n` +
        `║  SOLUÇÃO:                                                    ║\n` +
        `║  1. Abra um novo terminal                                    ║\n` +
        `║  2. Execute: npm run dev                                      ║\n` +
        `║  3. Aguarde até ver "Ready"                                  ║\n` +
        `║  4. Execute os testes novamente                             ║\n` +
        `║                                                              ║\n` +
        `║  URL esperada: ${baseUrl.padEnd(47)}║\n` +
        `╚══════════════════════════════════════════════════════════════╝\n\n` +
        `Erro técnico: ${error.message}`
    );
    improvedError.name = error.name;
    throw improvedError;
  }

  // we now have access to the err instance
  // and the mocha runnable this failed on
  throw error; // throw error to have test still fail
});
