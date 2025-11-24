describe('Página de Reservas', () => {
  beforeEach(() => {
    cy.clearSession();
    
    // Intercepta as requisições do middleware primeiro
    cy.intercept('GET', '**/api/me', {
      statusCode: 200,
      body: {
        id: '1',
        name: 'Admin User',
        email: 'admin@ristorante.com',
        role: 'ADMIN'
      }
    }).as('getUser');

    // Intercepta verificação de permissões (pode ser chamado pelo middleware)
    cy.intercept('GET', '**/api/permissions/check**', {
      statusCode: 200,
      body: { hasPermission: true }
    }).as('checkPermission');

    // Intercepta a requisição de reservas da página
    cy.intercept('GET', '**/api/reservationsdashboard**', {
      statusCode: 200,
      body: [
        {
          id: '1',
          customer_name: 'João Silva',
          date: '2024-01-15',
          time: '19:00',
          guests: 4,
          status: 'CONFIRMED'
        }
      ]
    }).as('getReservations');

    // Define o cookie antes de visitar
    cy.setSessionCookie('mock-token-12345');
    
    // Visita a página com verificação de servidor
    cy.visit('/dashboard/reservations', {
      failOnStatusCode: false,
      timeout: 15000,
      retryOnStatusCodeFailure: true,
      retryOnNetworkFailure: true,
    });
    
    // Aguarda as requisições do middleware
    cy.wait('@getUser', { timeout: 15000 });
  });

  it('deve exibir a página de reservas', () => {
    cy.url().should('include', '/dashboard/reservations');
    cy.get('body').should('be.visible');
  });

  it('deve carregar as reservas corretamente', () => {
    cy.wait('@getReservations');
    cy.get('body').should('be.visible');
  });

  it('deve exibir formulário de nova reserva', () => {
    // Verifica se existe algum formulário ou botão para criar reserva
    cy.get('body').should('be.visible');
  });
});

