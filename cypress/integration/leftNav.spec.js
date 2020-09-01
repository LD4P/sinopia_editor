describe('Left-nav test', () => {
  it('Opens the app', () => {
    cy.visit(Cypress.env('EDITOR_URL') || 'http://localhost:8000/')
    cy.contains('The underdrawing for the new world of linked data in libraries')
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
    cy.get('button[type="submit"]').contains('Login').click()
  })

  it('Opens Linked Data Editor', () => {
    cy.contains('a', 'Linked Data Editor').click()

    cy.url().should('include', '/templates')
  })

  it('Uploads resource templates', () => {
    cy.get('#searchInput')
      .type('resourceTemplate:testing:uber1')
      .should('have.value', 'resourceTemplate:testing:uber1')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)

    // Need to determine if should upload a resource template.
    cy.get('#resource-templates').then((rtDiv) => {
      if (rtDiv.find('div#no-rt-warning').length > 0) {
        addResourceTemplate('uber_template1.txt', 'http://localhost:3000/repository/resourceTemplate:testing:uber1')
        addResourceTemplate('uber_template2.txt', 'http://localhost:3000/repository/resourceTemplate:testing:uber2')
        addResourceTemplate('uber_template3.txt', 'http://localhost:3000/repository/resourceTemplate:testing:uber3')
        addResourceTemplate('uber_template4.txt', 'http://localhost:3000/repository/resourceTemplate:testing:uber4')

        // Waiting for indexing. If this proves problematic, can try a different approach.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000)

        // Go back to templates
        cy.get('a').contains('Resource Templates').click()
        cy.url().should('include', '/templates')

        cy.get('#searchInput')
          .type('resourceTemplate:testing:uber1')
          .should('have.value', 'resourceTemplate:testing:uber1')
      }
    })
  })

  it('Opens a resource template', () => {
    cy.contains('a', /^Uber template1$/).click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.url().should('include', '/editor')
  })

  it('Adds child nav for nested resources', () => {
    cy.get('button[aria-label="Add Uber template1, property1"]').click()
    cy.get('button.list-group-item').should('contain', 'Uber template2')
    cy.get('button.list-group-item').should('contain', 'Uber template3')
  })

  it('Marks properties with values with a check', () => {
    cy.get('input[placeholder="Uber template1, property4"]')
      .type('foo{enter}')
    cy.get('button.active > h5')
      .should('contain', 'Uber template1, property4')
      .should('contain', '✓')
  })

  it('Highlights nav when panel clicked', () => {
    cy.contains('h5', 'Uber template1, property6').click()
    cy.get('button.active > h5').should('contain', 'Uber template1, property6')
  })

  it('Scrolls panel property into view', () => {
    cy.isNotInViewport('div[data-label="Item of"]')
    cy.contains('button', 'Item of').click()
    // Wait for scroll
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.isInViewport('div[data-label="Item of"]')
    cy.get('button.active > h5').should('contain', 'Item of')
  })
})

const addResourceTemplate = (fixture, fixtureUri) => {
  cy.get('a').contains('Load RDF').click()
  cy.url().should('include', '/load')
  cy.contains('Load RDF into Editor')
  cy.fixture(fixture).then((json) => {
    // Type is to slow. See https://github.com/cypress-io/cypress/issues/1123
    cy.get('#resourceTextArea').paste(json)
    // .type(json, {delay: 0})
    cy.get('#uriInput')
      .type(fixtureUri)
    cy.get('button[type="submit"]:not(:disabled)').contains('Submit').click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)

    // Now on editor
    cy.url().should('include', '/editor')
    cy.get('button.editor-save').contains('Save').click()

    // Group choice modal
    cy.contains('Which group do you want to save to?')
    cy.get('div#group-choice-modal button').contains('Save').click()
  })
}
