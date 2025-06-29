/// <reference types="cypress" />

describe('Login spec', () => {
  beforeEach(() => {
    cy.visit('/login')
  });

  it('Login is successful', () => {
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

  it('Login fails', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {}
    })

    cy.get('input[formControlName=email]').type('yoga@studio.com')
    cy.get('input[formControlName=password]').type('password{enter}{enter}')

    cy.contains('.error', 'An error occurred').should('be.visible')

    cy.url().should('include', '/login')
  });

  it('Validation when required fields are empty', () => {
    cy.get('input[formControlName=email]').click().blur()
    cy.get('input[formControlName=email]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('input[formControlName=password]').click().blur()
    cy.get('input[formControlName=password]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.url().should('include', '/login')
  });
});