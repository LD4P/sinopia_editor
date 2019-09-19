import shortid from 'shortid'

describe('End-to-end test', function() {
  const title = shortid.generate()

  it('Opens the app', function() {
    cy.visit('http://localhost:8000')
    cy.contains('The underdrawing for the new world of linked data in libraries')
  })

  it('Logs in', function() {
    // Requires that CYPRESS_COGNITO_TEST_USER_NAME and CYPRESS_COGNITO_TEST_USER_PASS be et.
    // See https://docs.cypress.io/guides/guides/environment-variables.html
    // cy.url().should('include', '/commands/actions')
    cy.get('#username')
      .type(Cypress.env('COGNITO_TEST_USER_NAME'))
      .should('have.value', Cypress.env('COGNITO_TEST_USER_NAME'))
    cy.get('#password')
      .type(Cypress.env('COGNITO_TEST_USER_PASS'))
      .should('have.value', Cypress.env('COGNITO_TEST_USER_PASS'))
    cy.contains('Login').click()
    cy.contains('current cognito user: sinopia-devs_client-tester')
  })

  it('Opens Linked Data Editor', function() {
    cy.get('a').contains('Linked Data Editor').click()

    cy.url().should('include', '/templates')
    // cy.contains('No connection to the Sinopia Server is available, or there are no resources for any group.')
  })

  it('Uploads a resource template', function() {
    // Need to determine if should upload a resource template.
    // Both the resource template list and the notification that there are no loaded resource templates
    // have the same id. Waiting for that element to be present allows this test to be deterministic,
    // even though the rendering is async.
    cy.get('#resource-template-list').then((resourceTemplateList) => {
      if(resourceTemplateList.text().includes('No connection to the Sinopia Server is available, or there are no resources for any group.')) {
        cy.contains('Import a Profile').click()
        cy.contains('Drag and drop a resource template file')
        const fileName = 'LD4P_BIBFRAME_2.0_Title_Information.json'
        cy.fixture(fileName).then(fileJson => {
          const fileContent = JSON.stringify(fileJson)
          cy.get('input[type="file"]').upload({ fileContent, fileName, mimeType: 'application/json' })
        })
      }
    })
  })

  it('Opens a resource template', function() {
    cy.contains('Work Title').click()
    cy.url().should('include', '/editor')
  })

  it('Populates a resource template', function() {
    // Add a value for the Preferred Title
    cy.get('button[data-id="mainTitle"]').click()
    cy.get('input[placeholder="Preferred Title for Work"]')
      .type(`${title}{enter}`)
    cy.get('div.rbt-token').contains(title)
  })

  it('Previews the RDF', function() {
    cy.contains('Preview RDF').click()
    cy.contains(`<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "${title}"@en .`)
    cy.contains('<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:WorkTitle" .')
    cy.contains('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .')
  })

  it('Saves', function() {
    cy.get('button#modal-save').contains('Save & Publish').click()

    cy.contains('Which group do you want to save to?')
    cy.contains(/^Save$/).click()

    cy.contains('URI for this resource')
    cy.contains('Saved & Published ...').should('not.exist')
  })

  it('Search', function() {
    cy.get('a').contains('Search').click()
    cy.url().should('include', '/search')

    // Indexing latency is possible problem here.
    cy.get('input[placeholder="Search"]')
      .type(`${title}{enter}`)

    cy.contains('Your List of Bibliographic Metadata Stored in Sinopia')
    cy.contains(title)

  })

  it('Open existing resource in editor', function() {
    cy.get('button').contains(title).click()
    cy.url().should('include', '/editor')

    cy.get('h1').contains('Work Title')
    cy.contains('URI for this resource')
    cy.get('div.rbt-token').contains(title)
  })

  it('Logs out', function() {
    cy.get('button').contains('Sign out').click()
    // Well, sign out doesn't actually work ...
  })

})
