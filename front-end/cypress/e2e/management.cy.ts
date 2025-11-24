describe('Página de Gerenciamento', () => {
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

    cy.intercept('GET', '**/api/categories**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Bebidas',
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: '2',
          name: 'Pratos',
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    }).as('getCategories');

    cy.intercept('GET', '**/api/products**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          name: 'Coca-Cola',
          price: 5.50,
          category_id: '1',
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    }).as('getProducts');

    // Faz login como admin
    cy.setSessionCookie('mock-token-12345');
    cy.visit('/dashboard/management', {
      failOnStatusCode: false,
      timeout: 10000
    });
    cy.wait('@getUser', { timeout: 10000 });
    cy.wait('@getCategories', { timeout: 10000 });
    cy.wait('@getProducts', { timeout: 10000 });
  });

  it('deve exibir a página de gerenciamento', () => {
    cy.url().should('include', '/dashboard/management');
    cy.get('body').should('be.visible');
  });

  it('deve carregar categorias e produtos', () => {
    cy.wait('@getCategories');
    cy.wait('@getProducts');
    cy.get('body').should('be.visible');
  });

  it('deve restringir acesso para usuários sem permissão', () => {
    cy.clearSession();
    
    // Intercepta como usuário sem permissão
    cy.intercept('GET', '**/api/me', {
      statusCode: 200,
      body: {
        id: '2',
        name: 'Garçom User',
        email: 'garcom@ristorante.com',
        role: 'GARCOM'
      }
    }).as('getUserGarcom');

    cy.intercept('GET', '**/api/permissions/check**', {
      statusCode: 200,
      body: { hasPermission: false }
    }).as('checkPermission');

    cy.intercept('GET', '**/api/permissions/first-route**', {
      statusCode: 200,
      body: { route: '/dashboard/order' }
    }).as('getFirstRoute');

    cy.setSessionCookie('mock-garcom-token');
    cy.visit('/dashboard/management', {
      failOnStatusCode: false,
      timeout: 10000
    });

    // Deve ser redirecionado
    cy.url().should('satisfy', (url) => {
      return url.includes('/dashboard/unauthorized') || url.includes('/dashboard/order');
    });
  });
});

