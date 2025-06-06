/// <reference types="cypress" />

describe('Detail spec', () => {
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
    })
  });

  it('Show session information', () => {
    cy.get('input[formControlName=email]').type('yoga@studio.com')
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        }
      ],
    })

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.contains('span.ml1', 'Detail').click()

    cy.url().should('include', '/sessions/detail/1')

    cy.contains('h1', 'Session 1').should('be.visible')
    cy.contains('.ml1', '2 attendees').should('be.visible')
    cy.contains('.description', 'Description: A description').should('be.visible')
    cy.get('.ml1').contains('July 25, 2025')

    cy.get('.created').contains('Create at: May 1, 2025')
    cy.get('.updated').contains('Last update: May 1, 2025')

    cy.get('button[mat-icon-button]').click()

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
    })

    cy.url().should('include', '/sessions')
  })

  it('Delete session success', () => {
    cy.get('input[formControlName=email]').type('yoga@studio.com')
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        }
      ],
    })

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.contains('span.ml1', 'Detail').click()

    cy.url().should('include', '/sessions/detail/1')

    cy.contains('h1', 'Session 1').should('be.visible')
    cy.contains('.ml1', '2 attendees').should('be.visible')
    cy.contains('.description', 'Description: A description').should('be.visible')
    cy.get('.ml1').contains('July 25, 2025')

    cy.get('.created').contains('Create at: May 1, 2025')
    cy.get('.updated').contains('Last update: May 1, 2025')

    cy.intercept('DELETE', '/api/session/1', {
      statusCode: 200,
      body: [],
    }).as('deleteSession')

    cy.intercept('GET', '/api/session', {
      body: [
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
    })

    cy.contains('span.ml1', 'Delete').click()

    cy.wait('@deleteSession')

    cy.contains('.mat-simple-snack-bar-content', 'Session deleted !')

    cy.url().should('include', '/sessions')
  });

  it('Show correct buttons to admin', () => {
    cy.get('input[formControlName=email]').type('yoga@studio.com')
    cy.get('input[formControlName=password]').type('test!1234{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.contains('mat-card-title', 'Session 1').should('be.visible')
    cy.contains('mat-card-subtitle', 'Session on July 22, 2025').should('be.visible')
    cy.contains('mat-card-content', 'A description').should('be.visible')

    cy.contains('span.ml1', 'Detail').should('be.visible')
    cy.contains('span.ml1', 'Edit').should('be.visible')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        }
      ],
    })

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.contains('span.ml1', 'Detail').click()

    cy.url().should('include', '/sessions/detail/1')

    cy.contains('span.ml1', 'Delete').should('be.visible')
  });

  it('Participate success', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })

    cy.get('input[formControlName=email]').type('user@studio.com')
    cy.get('input[formControlName=password]').type('password{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        }
      ],
    })

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [4, 5],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.contains('span.ml1', 'Detail').click()

    cy.url().should('include', '/sessions/detail/1')

    cy.contains('h1', 'Session 1').should('be.visible')
    cy.contains('.ml1', '2 attendees').should('be.visible')
    cy.contains('.description', 'Description: A description').should('be.visible')
    cy.get('.ml1').contains('July 25, 2025')

    cy.get('.created').contains('Create at: May 1, 2025')
    cy.get('.updated').contains('Last update: May 1, 2025')

    cy.intercept('POST', '/api/session/1/participate/1', {
      statusCode: 200,
      body: [],
    }).as('participate')

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [4, 5, 1],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      }
    }).as('updatedSession')

    cy.contains('span.ml1', 'Participate').click()

    cy.wait('@participate')
    cy.wait('@updatedSession')

    cy.contains('span.ml1', '3 attendees').should('be.visible')
    cy.contains('span.ml1', 'Do not participate').should('be.visible')
  });

  it('Do not participate success', () => {
    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: false
      },
    })

    cy.get('input[formControlName=email]').type('user@studio.com')
    cy.get('input[formControlName=password]').type('password{enter}{enter}')

    cy.url().should('include', '/sessions')

    cy.intercept('GET', '/api/teacher/1', {
      body: [
        {
          id: 1,
          firstName: 'Claire',
          lastName: 'Beaumont'
        }
      ],
    })

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [1, 2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      },
    })

    cy.contains('span.ml1', 'Detail').click()

    cy.url().should('include', '/sessions/detail/1')

    cy.contains('h1', 'Session 1').should('be.visible')
    cy.contains('.ml1', '2 attendees').should('be.visible')
    cy.contains('.description', 'Description: A description').should('be.visible')
    cy.get('.ml1').contains('July 25, 2025')

    cy.get('.created').contains('Create at: May 1, 2025')
    cy.get('.updated').contains('Last update: May 1, 2025')

    cy.intercept('DELETE', '/api/session/1/participate/1', {
      statusCode: 200,
      body: [],
    }).as('unparticipate')

    cy.intercept('GET', '/api/session/1', {
      body: {
        id: 1,
        name: 'Session 1',
        description: 'A description',
        date: '2025-07-25T12:00:00.000Z',
        teacher_id: 1,
        users: [2],
        createdAt: '2025-05-01T12:00:00.000Z',
        updatedAt: '2025-05-01T12:00:00.000Z'
      }
    }).as('updatedSession')

    cy.contains('span.ml1', 'Do not participate').click()

    cy.wait('@unparticipate')
    cy.wait('@updatedSession')

    cy.contains('span.ml1', '1 attendee').should('be.visible')
    cy.contains('span.ml1', 'Participate').should('be.visible')
  });
});
