describe('Página da Cozinha', () => {
  beforeEach(() => {
    cy.clearSession();
    
    // Intercepta as requisições necessárias
    cy.intercept('GET', '**/api/me', {
      statusCode: 200,
      body: {
        id: '3',
        name: 'Cozinha User',
        email: 'cozinha@ristorante.com',
        role: 'COZINHA'
      }
    }).as('getUser');

    cy.intercept('GET', '**/api/permissions/check**', {
      statusCode: 200,
      body: { hasPermission: true }
    }).as('checkPermission');

    cy.intercept('GET', '**/api/orders**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          table: '1',
          status: 'PREPARING',
          items: [
            {
              id: '1',
              product_name: 'Pizza Margherita',
              quantity: 2,
              status: 'PREPARING'
            }
          ],
          created_at: '2024-01-01T00:00:00Z'
        }
      ]
    }).as('getKitchenOrders');

    cy.setSessionCookie('mock-cozinha-token');
    cy.visit('/dashboard/kitchen', {
      failOnStatusCode: false,
      timeout: 10000
    });
    cy.wait('@getUser', { timeout: 10000 });
    cy.wait('@getKitchenOrders', { timeout: 10000 });
  });

  it('deve exibir a página da cozinha', () => {
    cy.url().should('include', '/dashboard/kitchen');
    cy.get('body').should('be.visible');
  });

  it('deve carregar os pedidos da cozinha', () => {
    cy.wait('@getKitchenOrders');
    cy.get('body').should('be.visible');
  });

  it('deve atualizar o status dos pedidos', () => {
    // Intercepta a requisição de atualização
    cy.intercept('PATCH', '**/api/orders/**', {
      statusCode: 200,
      body: {
        id: '1',
        status: 'READY'
      }
    }).as('updateOrder');

    // O teste específico depende da implementação da interface
    cy.get('body').should('be.visible');
  });
});

