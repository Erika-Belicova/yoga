/// <reference types="cypress" />

describe('Form spec', () => {
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
        }
      ],
    }).as('sessions')
  });

  it('Create session success', () => {
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')
    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        },
        {
          id: 2,
          firstName: 'Jean',
          lastName: 'Dupont'
        }
      ],
    }).as('teachers')

    cy.contains('span.ml1', 'Create').click()

    cy.url().should('include', '/sessions/create')

    cy.get('h1').contains('Create session')

    cy.get('input[formControlName=name]').type("Session")
    cy.get('input[formControlName=date]').type("2025-07-28")

    cy.wait('@teachers')

    cy.get('mat-select[formControlName=teacher_id]').click()
    cy.get('mat-option').should('have.length.at.least', 2)
    cy.get('mat-option').contains('Claire Beaumont').click()

    cy.get('textarea[formControlName=description]').type("A short description")

    cy.intercept('POST', '/api/session', {
      body: {
        id: 2,
        name: 'sessionName',
        description: 'description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

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
          description: 'A short description',
          date: '2025-07-25T12:00:00.000Z',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2025-05-01T12:00:00.000Z',
          updatedAt: '2025-05-01T12:00:00.000Z'
        }
      ],
    }).as('sessions')

    cy.get('button').contains('Save').click()

    cy.wait('@sessions')

    cy.get('.mat-simple-snack-bar-content').contains('Session created !')

    cy.url().should('include', '/sessions')
  });

  it('Validation when required fields are empty', () => {
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        },
        {
          id: 2,
          firstName: 'Jean',
          lastName: 'Dupont'
        }
      ],
    }).as('teachers')

    cy.intercept(
      {
        method: 'POST',
        url: '/api/session',
      },
      []).as('session')

    cy.contains('span.ml1', 'Create').click()

    cy.url().should('include', '/sessions/create')

    cy.get('input[formControlName=name]').click().blur()
    cy.get('input[formControlName=name]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('input[formControlName=date]').click().blur()
    cy.get('input[formControlName=date]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('mat-select[formControlName=teacher_id]').click().blur()
    cy.get('body').click(0, 0).blur()
    cy.get('mat-select[formControlName=teacher_id]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

    cy.get('textarea[formControlName=description]').click().blur()
    cy.get('textarea[formControlName=description]').should('have.class', 'ng-touched').and('have.class', 'ng-invalid')

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
        }
      ],
    }).as('sessions')

    cy.get('.mat-icon').click()

    cy.wait('@sessions')

    cy.url().should('include', '/sessions')
  });

  it('Update session success', () => {
    cy.get('input[formControlName=email]').type("yoga@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        },
        {
          id: 2,
          firstName: 'Jean',
          lastName: 'Dupont'
        }
      ],
    }).as('teachers')

    cy.contains('span.ml1', 'Create').click()

    cy.url().should('include', '/sessions/create')

    cy.get('h1').contains('Create session')

    cy.get('input[formControlName=name]').type("Session")
    cy.get('input[formControlName=date]').type("2025-07-28")

    cy.wait('@teachers')

    cy.get('mat-select[formControlName=teacher_id]').click()
    cy.get('mat-option').should('have.length.at.least', 2)
    cy.get('mat-option').contains('Claire Beaumont').click()

    cy.get('textarea[formControlName=description]').type("A short description")

    cy.intercept('POST', '/api/session', {
      body: {
        id: 2,
        name: 'sessionName',
        description: 'description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

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
          description: 'A short description',
          date: '2025-07-25T12:00:00.000Z',
          teacher_id: 1,
          users: [1, 2],
          createdAt: '2025-05-01T12:00:00.000Z',
          updatedAt: '2025-05-01T12:00:00.000Z'
        }
      ],
    }).as('sessions')

    cy.get('button').contains('Save').click()

    cy.wait('@sessions')

    cy.get('.mat-simple-snack-bar-content').contains('Session created !')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'sessionName',
        description: 'description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    }).as('session-edit')

    cy.contains('span.ml1', 'Edit').click()

    cy.url().should('include', '/sessions/update/1')

    cy.get('h1').contains('Update session')

    cy.get('input[formControlName=name]').clear().type("Updated session")
    cy.get('input[formControlName=date]').clear().type("2025-07-30")

    cy.wait('@teachers')

    cy.get('mat-select[formControlName=teacher_id]').click()
    cy.get('mat-option').should('have.length.at.least', 2)
    cy.get('mat-option').contains('Jean Dupont').click()

    cy.get('textarea[formControlName=description]').clear().type("An updated description")

    cy.intercept('PUT', '/api/session/1', {
      body: {
        id: 2,
        name: 'sessionName',
        description: 'description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.intercept('GET', '/api/session', {
      body: [
        {
          id: 1,
          name: 'Updated session',
          description: 'An updated description',
          date: '2025-07-24T12:00:00.000Z',
          teacher_id: 1,
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

    cy.get('button').contains('Save').click()

    cy.wait('@sessions')

    cy.get('.mat-simple-snack-bar-content').contains('Session updated !')

    cy.url().should('include', '/sessions')
  });

  it('Redirect when user does not have access', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=email]').type("user@studio.com")
    cy.get('input[formControlName=password]').type(`${"password"}{enter}{enter}`)

    cy.url().should('include', '/sessions')

    cy.visit('/sessions/update/1')

    cy.url().should('include', '/login')
  });
});
