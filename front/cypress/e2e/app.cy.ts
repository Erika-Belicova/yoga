/// <reference types="cypress" />

describe('Logout spec', () => {
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

    cy.intercept('GET', '/api/session', [])

    cy.get('input[formControlName=email]').type('yoga@studio.com')
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}')

    cy.url().should('include', '/sessions')
  });

  it('Logout is successful', () => {
    cy.contains('span.link', 'Logout').click()

    cy.url().should('eq', Cypress.config().baseUrl)
  });
});