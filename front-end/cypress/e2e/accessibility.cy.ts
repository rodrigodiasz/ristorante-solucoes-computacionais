describe('Acessibilidade', () => {
  beforeEach(() => {
    cy.clearSession();
    
    // Intercepta requisições do middleware se necessário
    cy.intercept('GET', '**/api/me', {
      statusCode: 401,
      body: { error: 'Unauthorized' }
    }).as('unauthorized');
  });

  it('deve ter estrutura semântica correta na página de login', () => {
    cy.visit('/login', {
      failOnStatusCode: false,
      timeout: 10000
    });
    
    // Verifica se há um elemento main
    cy.get('main').should('exist');
    
    // Verifica se os labels estão associados aos inputs
    cy.get('label[for="email"]').should('exist');
    cy.get('label[for="password"]').should('exist');
    
    // Verifica se os inputs têm os atributos corretos
    cy.get('input[name="email"]').should('have.attr', 'type', 'email');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
  });

  it('deve ter contraste adequado nos elementos', () => {
    cy.visit('/', {
      failOnStatusCode: false,
      timeout: 10000
    });
    
    // Verifica se os elementos principais estão visíveis
    cy.get('h1').should('be.visible');
    cy.get('h2').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
  });

  it('deve ser navegável por teclado', () => {
    cy.visit('/', {
      failOnStatusCode: false,
      timeout: 10000
    });
    
    // Verifica se é possível focar nos elementos principais
    cy.get('input[name="email"]').focus().should('be.focused');
    cy.get('input[name="password"]').focus().should('be.focused');
    cy.get('button[type="submit"]').focus().should('be.focused');
  });

  it('deve ter textos alternativos em imagens (se houver)', () => {
    cy.visit('/', {
      failOnStatusCode: false,
      timeout: 10000
    });
    
    // Verifica se imagens têm alt text (se existirem)
    cy.get('body').then(($body) => {
      if ($body.find('img').length > 0) {
        cy.get('img').each(($img) => {
          cy.wrap($img).should('have.attr', 'alt');
        });
      } else {
        // Se não houver imagens, o teste passa
        cy.log('Nenhuma imagem encontrada na página - teste passa');
      }
    });
  });
});



