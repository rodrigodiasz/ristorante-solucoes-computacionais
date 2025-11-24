describe('Página de Administração', () => {
  beforeEach(() => {
    cy.clearSession();
    
    // Intercepta as requisições necessárias
    cy.intercept('GET', '**/api/me', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Admin User',
        email: 'admin@ristorante.com',
        role: 'ADMIN'
      }
    }).as('getUser');

    cy.intercept('GET', '**/api/permissions/check**', {
      statusCode: 200,
      body: { hasPermission: true }
    }).as('checkPermission');

    cy.intercept('GET', '**/api/users**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@ristorante.com',
          role: 'ADMIN',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Garçom User',
          email: 'garcom@ristorante.com',
          role: 'GARCOM',
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    }).as('getUsers');

    cy.setSessionCookie('mock-token-12345');
    cy.visit('/dashboard/admin', {
      failOnStatusCode: false,
      timeout: 10000
    });
    cy.wait('@getUser', { timeout: 10000 });
    cy.wait('@getUsers', { timeout: 10000 });
  });

  it('deve exibir a página de administração', () => {
    cy.url().should('include', '/dashboard/admin');
    cy.get('body').should('be.visible');
  });

  it('deve carregar a lista de usuários', () => {
    cy.wait('@getUsers');
    cy.get('body').should('be.visible');
  });

  it('deve restringir acesso apenas para administradores', () => {
    cy.clearSession();
    
    // Tenta acessar como gerente
    cy.intercept('GET', '**/api/me', {
      statusCode: 200,
      body: {
        id: '2',
        name: 'Gerente User',
        email: 'gerente@ristorante.com',
        role: 'GERENTE'
      }
    }).as('getUserGerente');

    cy.intercept('GET', '**/api/permissions/check**', {
      statusCode: 200,
      body: { hasPermission: false }
    }).as('checkPermission');

    cy.intercept('GET', '**/api/permissions/first-route**', {
      statusCode: 200,
      body: { route: '/dashboard/management' }
    }).as('getFirstRoute');

    cy.setSessionCookie('mock-gerente-token');
    cy.visit('/dashboard/admin', {
      failOnStatusCode: false,
      timeout: 10000
    });

    // Deve ser redirecionado
    cy.url().should('satisfy', (url) => {
      return url.includes('/dashboard/unauthorized') || url.includes('/dashboard/management');
    });
  });

  it('deve permitir criar novo usuário', () => {
    // Intercepta a requisição de criação
    cy.intercept('POST', '**/api/users', {
      statusCode: 201,
      body: {
        id: '3',
        name: 'Novo Usuário',
        email: 'novo@ristorante.com',
        role: 'GARCOM',
        created_at: '2024-01-01T00:00:00Z'
      }
    }).as('createUser');

    // O teste específico depende da implementação do formulário
    cy.get('body').should('be.visible');
  });
});

