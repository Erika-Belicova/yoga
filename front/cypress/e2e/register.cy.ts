/// <reference types="cypress" />

describe('Register spec', () => {
  beforeEach(() => {
    cy.visit('/register')
  });

  it('Register successfull', () => {
    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 2,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })

    cy.get('input[formControlName=firstName]').type("Yoga")
    cy.get('input[formControlName=lastName]').type("Studio")
    cy.get('input[formControlName=email]').type("test@studio.com")
    cy.get('input[formControlName=password]').type(`${"password"}{enter}{enter}`)

    cy.url().should('include', '/login')
  })

  it('Register failed', () => {
    cy.intercept('POST', '/api/auth/register', {
      statusCode: 401,
      body: {}
    })

    cy.get('input[formControlName=firstName]').type("Yoga")
    cy.get('input[formControlName=lastName]').type("Studio")
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"password"}{enter}{enter}`)

    cy.get('.error').should('be.visible').and('contain', 'An error occurred')

    cy.url().should('include', '/register')
  })

  it('Validation when required fields are empty', () => {
    cy.get('input[formControlName=firstName]').click().blur()
    cy.get('input[formControlName=firstName]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('input[formControlName=lastName]').click().blur()
    cy.get('input[formControlName=lastName]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('input[formControlName=email]').click().blur()
    cy.get('input[formControlName=email]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('input[formControlName=password]').click().blur()
    cy.get('input[formControlName=password]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.url().should('include', '/register')
  })
});