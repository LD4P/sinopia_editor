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
    cy.contains('Login').click()
    cy.contains('current cognito user: sinopia-devs_client-tester')
  })

  it('Opens Linked Data Editor', () => {
    cy.contains('a', 'Linked Data Editor').click()

    cy.url().should('include', '/templates')
  })

  it('Uploads a profile template', () => {
    // Need to determine if should upload a resource template.
    // Both the resource template list and the notification that there are no loaded resource templates
    // have the same id. Waiting for that element to be present allows this test to be deterministic,
    // even though the rendering is async.
    cy.get('#resource-template-list').then((resourceTemplateList) => {
      if (resourceTemplateList.text().includes('No resource template are available.')) {
        cy.contains('Import a Profile').click()
        cy.contains('Drag and drop a profile or resource template file')
        const fileName = 'LD4P_BIBFRAME_2.0_Title_Information.json'
        cy.fixture(fileName).then((fileJson) => {
          const fileContent = JSON.stringify(fileJson)
          cy.get('input[type="file"]').upload({ fileContent, fileName, mimeType: 'application/json' })
        })
      }
    })
  })

  it('Opens a resource template', () => {
    // It may take some time for the Work Title to be listed, especially when it is uploaded.
    cy.contains('a', /^Work Title$/, { timeout: 15000 }).click()
    cy.url().should('include', '/editor')
  })

  it('Populates a resource template', () => {
    // Add a value for the Preferred Title
    cy.get('button[data-id="mainTitle"]').click()
    cy.get('input[placeholder="Preferred Title for Work"]')
      .type(`${title}{enter}`)
    cy.get('div.rbt-token').contains(title)
  })

  it('Previews the RDF', () => {
    cy.get('button[title="Preview RDF"]').click()
    cy.get('select#rdfFormat').select('n-triples')
    cy.contains(`<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "${title}"@en .`)
    cy.contains('<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:WorkTitle" .')
    cy.contains('<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> .')
  })

  it('Saves', () => {
    cy.get('button#modal-save').click()

    cy.contains('Which group do you want to save to?')
    cy.get('div#group-choice-modal button').contains('Save').click()

    cy.contains('URI for this resource')
    cy.contains('Saved ...').should('not.exist')
  })

  it('Search', () => {
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

    cy.contains('h1', 'Work Title')
    cy.contains('URI for this resource')
    cy.get('div.rbt-token').contains(title)
  })

  it('Logs out', () => {
    cy.get('button').contains('Sign out').click()
    // Well, sign out doesn't actually work ...
  })
})
