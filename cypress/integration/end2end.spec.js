import shortid from 'shortid'

describe('End-to-end test', () => {
  // Avoid characters that will cause search to bomb, like -.
  shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@_')
  const title = shortid.generate()

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

  it('Uploads a resource template', () => {
    cy.get('#searchInput')
      .type('resourceTemplate:bf2:WorkTitle')
      .should('have.value', 'resourceTemplate:bf2:WorkTitle')
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)

    // Need to determine if should upload a resource template.
    cy.get('#resource-templates').then((rtDiv) => {
      if (rtDiv.find('div#no-rt-warning').length > 0) {
        cy.get('a').contains('Load RDF').click()
        cy.url().should('include', '/load')
        cy.contains('Load RDF into Editor')
        cy.fixture('WorkTitle.txt').then((json) => {
          // Type is to slow. See https://github.com/cypress-io/cypress/issues/1123
          cy.get('#resourceTextArea').paste(json)
          // .type(json, {delay: 0})
          cy.get('#uriInput')
            .type('http://localhost:3000/repository/resourceTemplate:bf2:WorkTitle')
          cy.get('button[type="submit"]:not(:disabled)').contains('Submit').click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(500)

          // Now on editor
          cy.url().should('include', '/editor')
          cy.get('button.editor-save').contains('Save').click()

          // Group choice modal
          cy.contains('Which group do you want to save to?')
          cy.get('div#group-choice-modal button').contains('Save').click()

          // Waiting for indexing. If this proves problematic, can try a different approach.
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(10000)

          // Go back to templates
          cy.get('a').contains('Resource Templates').click()
          cy.url().should('include', '/templates')

          cy.get('#searchInput')
            .type('resourceTemplate:bf2:WorkTitle')
            .should('have.value', 'resourceTemplate:bf2:WorkTitle')
        })
      }
    })
  })

  it('Opens a resource template', () => {
    cy.contains('a', /^Work Title$/).click()
    cy.url().should('include', '/editor')
  })

  it('Populates a resource template', () => {
    // Add a value for the Preferred Title
    cy.get('button[aria-label="Add Preferred Title for Work"]').click()
    cy.get('input[placeholder="Preferred Title for Work"]')
      .type(`${title}{enter}`)
    cy.get('div.rbt-token').contains(title)
  })

  it('Previews the RDF', () => {
    cy.get('button[title="Preview RDF"]').first().click()
    cy.get('select#rdfFormat').select('n-triples')
    cy.contains(`<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "${title}"@eng .`)
    cy.contains('<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .')
    cy.contains('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .')
  })

  it('Saves', () => {
    cy.get('button.modal-save').click()

    cy.contains('Which group do you want to save to?')
    cy.get('div#group-choice-modal button').contains('Save').click()

    cy.contains('URI for this resource')
    cy.contains('Saved').should('not.exist')
  })

  it('Search', () => {
    // Waiting for indexing. If this proves problematic, can try a different approach.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000)

    cy.get('a').contains('Search').click()
    cy.url().should('include', '/search')

    // Indexing latency is possible problem here.
    // Force is necessary because reflow of search inputs is suboptimal.
    cy.get('input#searchInput')
      .type(`${title}{enter}`, { force: true })

    cy.contains(title)
  })

  it('Open existing resource in editor', () => {
    cy.get('button[title=Edit]').click()
    cy.url().should('include', '/editor')

    cy.contains('h3', 'Work Title')
    cy.contains('URI for this resource')
    cy.get('div.rbt-token').contains(title)
  })

  it('Logs out', () => {
    cy.contains('a', 'Logout').click()
    // Well, sign out doesn't actually work ...
  })
})
