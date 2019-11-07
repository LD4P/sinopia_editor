describe('Looking at the Help and Resources gutter', () => {
  it('Opens the app', () => {
    cy.visit(Cypress.env('EDITOR_URL') || 'http://localhost:8000/')
    cy.contains('The underdrawing for the new world of linked data in libraries')
  })

  it('Opens help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Closes help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Logs in', () => {
    // Requires that COGNITO_TEST_USER_NAME and COGNITO_TEST_USER_PASS be available as env variables.
    // See https://docs.cypress.io/guides/guides/environment-variables.html
    cy.get('#username')
      .type(Cypress.env('COGNITO_TEST_USER_NAME'))
      .should('have.value', Cypress.env('COGNITO_TEST_USER_NAME'))
    cy.get('#password')
      .type(Cypress.env('COGNITO_TEST_USER_PASS'))
      .should('have.value', Cypress.env('COGNITO_TEST_USER_PASS'))
    cy.contains('Login').click()
    cy.contains('current cognito user: sinopia-devs_client-tester')
  })

  it('Opens Linked Data Editor', () => {
    cy.contains('a', 'Linked Data Editor').click()

    cy.url().should('include', '/templates')
  })

  it('Opens help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Closes help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Opens Search', () => {
    cy.contains('a', 'Search').click()

    cy.url().should('include', '/search')
  })

  it('Opens help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Closes help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Opens Load RDF', () => {
    cy.contains('a', 'Load RDF').click()

    cy.url().should('include', '/load')
  })

  it('Opens help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Closes help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Opens Exports', () => {
    cy.contains('a', 'Exports').click()

    cy.url().should('include', '/exports')
  })

  it('Opens help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })

  it('Closes help and resources', () => {
    cy.contains('a', 'Help and Resources').click()

    cy.contains('External Identifier Sources and Vocabularies')
  })
})
