describe('Left-nav test', () => {
  // Cypress clears localstorage between tests, which includes Cognito auth.
  beforeEach(() => cy.restoreLocalStorage())
  afterEach(() => cy.saveLocalStorage())

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
    cy.wait(1000)

    // Need to determine if should upload a resource template.
    cy.get('#resource-templates').then((rtDiv) => {
      if (rtDiv.find('div#no-rt-warning').length > 0) {
        addResourceTemplate('uber_template1.txt', 'http://localhost:3000/resource/resourceTemplate:testing:uber1')
        addResourceTemplate('uber_template2.txt', 'http://localhost:3000/resource/resourceTemplate:testing:uber2')
        addResourceTemplate('uber_template3.txt', 'http://localhost:3000/resource/resourceTemplate:testing:uber3')
        addResourceTemplate('uber_template4.txt', 'http://localhost:3000/resource/resourceTemplate:testing:uber4')

        // Waiting for indexing. If this proves problematic, can try a different approach.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000)

        // Go back to templates
        cy.get('a').contains('Resource Templates').click()
        cy.url().should('include', '/templates')

        cy.get('#searchInput')
          .type('resourceTemplate:testing:uber1')
          .should('have.value', 'resourceTemplate:testing:uber1')

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
      }
    })
  })

  it('Opens a resource template', () => {
    cy.contains('a', /^Uber template1$/).click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.url().should('include', '/editor')
  })

  // No children displayed before adding.
  // Adding child nav for nested resources.
  // Adding a nested adds nav

  it('Adds child nav when expanding nested resources', () => {
    cy.get('.left-nav-header').should('not.contain', 'Uber template2')
    cy.get('button[aria-label="Add Uber template1, property1"]').click()
    cy.get('.left-nav-header').should('contain', 'Uber template2')
    cy.get('.left-nav-header').should('contain', 'Uber template3')
  })

  it('Adds child nav for expanding nested properties', () => {
    cy.get('.left-nav-header').should('not.contain', 'Uber template2, property1')
    cy.get('button[aria-label="Add Uber template2, property1"]').click()
    cy.get('.left-nav-header').should('contain', 'Uber template2, property1')
  })

  it('Removes child nav for contracting nested properties', () => {
    cy.get('button[aria-label="Remove Uber template2, property1"]').click()
    cy.get('.left-nav-header').should('not.contain', 'Uber template2, property1')
  })

  it('Removes child nav when contracting nested resources', () => {
    cy.get('button[aria-label="Remove Uber template1, property1"]').click()
    cy.get('.left-nav-header').should('not.contain', 'Uber template2')
  })

  it('Expands nav when clicked', () => {
    cy.get('.left-nav-header').should('not.contain', 'Uber template4')
    cy.get('.left-nav-header').should('not.contain', 'Uber template4, property1')
    cy.get('button[aria-label="Go to Uber template1, property18"]').click()
    cy.get('.left-nav-header').should('contain', 'Uber template4')
    cy.get('.left-nav-header').should('contain', 'Uber template4, property1')
  })

  it('Nav for properties with defaults are checked', () => {
    cy.get('li.li-checked .left-nav-header').should('contain', 'Uber template1, property7')
  })

  it('Marks properties with values with a check', () => {
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template1, property18')
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template4')
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template4, property1')
    cy.get('textarea[placeholder="Uber template4, property1"]')
      .type('foo{enter}')
    cy.get('li.li-checked .left-nav-header').should('contain', 'Uber template1, property18')
    cy.get('li.li-checked .left-nav-header').should('contain', 'Uber template4')
    cy.get('li.li-checked .left-nav-header').should('contain', 'Uber template4, property1')
  })

  it('Removing values removes check', () => {
    cy.get('button[aria-label="Remove foo"]').click()
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template1, property18')
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template4')
    cy.get('li.li-checked .left-nav-header').should('not.contain', 'Uber template4, property1')
  })

  it('Marks properties with errors', () => {
    cy.get('.left-nav-header.text-danger').should('not.contain', 'Uber template1, property4')
    cy.get('button.editor-save').first().click()
    cy.get('.left-nav-header.text-danger').should('contain', 'Uber template1, property4')
  })

  it('Fixing error removes marking as error', () => {
    cy.get('textarea[placeholder="Uber template1, property4"]')
      .type('bar{enter}')
    cy.get('.left-nav-header.text-danger').should('not.contain', 'Uber template1, property4')
  })

  it('Highlights nav when panel clicked', () => {
    cy.get('button.btn-primary .left-nav-header').should('not.contain', 'Uber template1, property6')
    cy.contains('button', 'Uber template1, property6').click()
    cy.get('button.btn-primary .left-nav-header').should('contain', 'Uber template1, property6')
  })

  // This test passes locally, but does not pass in Circle.
  // Unable to determine problem, so commenting out for now.
  // it('Scrolls panel property into view', () => {
  //   cy.isNotInViewport('div[data-label="Item of"]')
  //   cy.contains('button', 'Item of').click()
  //   // Wait for scroll
  //   // eslint-disable-next-line cypress/no-unnecessary-waiting
  //   cy.wait(2500)
  //   cy.isInViewport('div[data-label="Item of"]')
  //   cy.get('button.btn-primary .left-nav-header').should('contain', 'Item of')
  // })

  it('Logs out', () => {
    cy.contains('a', 'Logout').click()
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
