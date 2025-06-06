/// <reference types="cypress" />

describe('Me spec', () => {
  beforeEach(() => {
    cy.visit('/login')
  });

  it('Show account information (admin)', () => {
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
    cy.intercept('GET', '/api/user/1', {
      body: {
        id: 1,
        email: 'yoga@studio.com',
        firstName: 'Admin',
        lastName: 'ADMIN',
        admin: true,
        createdAt: '2025-04-01T12:00:00.000Z',
        updatedAt: '2025-04-03T12:00:00.000Z'
      },
    })

    cy.contains('span.link', 'Account').click()

    cy.url().should('include', '/me')

    cy.contains('h1', 'User information').should('be.visible')
    cy.contains('p', 'Name: Admin ADMIN').should('be.visible')
    cy.contains('p', 'Email: yoga@studio.com').should('be.visible')
    cy.contains('.my2', 'You are admin').should('be.visible')

    cy.contains('.p2', 'April 1, 2025').should('be.visible')
    cy.contains('.p2', 'April 3, 2025').should('be.visible')

    cy.get('mat-icon').click()

    cy.url().should('include', '/sessions')
  });

  it('Show account information (user) and delete account', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })

    cy.intercept('GET', '/api/session', [])

    cy.get('input[formControlName=email]').type('user@studio.com')
    cy.get('input[formControlName=password]').type('password{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/user/2', {
      body: {
        id: 2,
        email: 'user@studio.com',
        firstName: 'User',
        lastName: 'USER',
        admin: false,
        createdAt: '2025-04-01T12:00:00.000Z',
        updatedAt: '2025-04-03T12:00:00.000Z'
      },
    })

    cy.contains('span.link', 'Account').click()

    cy.url().should('include', '/me')

    cy.contains('h1', 'User information').should('be.visible')
    cy.contains('p', 'Name: User USER').should('be.visible')
    cy.contains('p', 'Email: user@studio.com').should('be.visible')

    cy.contains('.my2 > p', 'Delete my account:').should('be.visible')
    cy.contains('.ml1', 'Detail').should('be.visible')

    cy.contains('.p2', 'April 1, 2025').should('be.visible')
    cy.contains('.p2', 'April 3, 2025').should('be.visible')

    cy.intercept('DELETE', '/api/user/2', {
      body: {},
    })

    cy.get('.my2 > .mat-focus-indicator').click()

    cy.contains('.mat-simple-snack-bar-content', 'Your account has been deleted !')

    cy.url().should('eq', Cypress.config().baseUrl)
  });
});