/// <reference types="cypress" />

describe('NotFound spec', () => {
  beforeEach(() => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Session 1',
          description: 'A description',
          date: '2025-07-22T12:00:00.000Z',
          teacher_id: 2,
          users: [2, 3],
          createdAt: '2025-05-01T12:00:00.000Z',
          updatedAt: '2025-05-01T12:00:00.000Z'
        },
        {
          id: 2,
          name: 'Session 2',
          description: 'An short description',
          date: '2025-07-28T12:00:00.000Z',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2025-05-01T12:00:00.000Z',
          updatedAt: '2025-05-01T12:00:00.000Z'
        }
      ],
    }).as('sessions')
  });

  it('Redirect to page not found', () => {
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')

    cy.visit('/login/user')

    cy.get('h1').should('contain.text', 'Page not found !').should('be.visible')
  });
});