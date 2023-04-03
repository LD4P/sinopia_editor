describe("End-to-end test", () => {
  const title = `title-${new Date().toISOString()}`

  // Cypress clears localstorage between tests, which includes Cognito auth.
  beforeEach(() => cy.restoreLocalStorage())
  afterEach(() => cy.saveLocalStorage())

  it("Opens the app", () => {
    cy.visit(Cypress.env("EDITOR_URL") || "http://localhost:8000/")
    cy.contains(
      "The underdrawing for the new world of linked data in libraries"
    )
  })

  it("Logs in", () => {
    // Requires that COGNITO_TEST_USER_NAME and COGNITO_TEST_USER_PASS be available as env variables.
    // See https://docs.cypress.io/guides/guides/environment-variables.html
    cy.get("#username").type(Cypress.env("COGNITO_TEST_USER_NAME"))
    cy.get("#username").should(
      "have.value",
      Cypress.env("COGNITO_TEST_USER_NAME")
    )
    cy.get("#password").type(Cypress.env("COGNITO_TEST_USER_PASS"))
    cy.get("#password").should(
      "have.value",
      Cypress.env("COGNITO_TEST_USER_PASS")
    )
    cy.get('button[type="submit"]').contains("Login").click()
  })

  it("Opens Linked Data Editor", () => {
    cy.contains("a", "Linked Data Editor").scrollIntoView()
    cy.contains("a", "Linked Data Editor").click()
    cy.url().should("include", "/dashboard")

    cy.contains("a", "Resource Templates").click()
    cy.url().should("include", "/templates")
  })

  it("Uploads a resource template", () => {
    cy.get("#searchInput").type("resourceTemplate:bf2:WorkTitle")
    cy.get("#searchInput").should(
      "have.value",
      "resourceTemplate:bf2:WorkTitle"
    )
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    // Need to determine if should upload a resource template.
    cy.get("#resource-templates").then((rtDiv) => {
      if (rtDiv.find("div#no-rt-warning").length > 0) {
        cy.get(".dropdown-toggle").click()
        cy.get("a").contains("Load RDF").click()
        cy.url().should("include", "/load")
        cy.contains("Load RDF into Editor")
        cy.fixture("WorkTitle.txt").then((json) => {
          // Type is to slow. See https://github.com/cypress-io/cypress/issues/1123
          cy.get("#resourceTextArea").paste(json)
          cy.get("#uriInput").type(
            "http://localhost:3000/resource/resourceTemplate:bf2:WorkTitle"
          )
          cy.get('button[type="submit"]:not(:disabled)')
            .contains("Submit")
            .scrollIntoView()
          cy.get('button[type="submit"]:not(:disabled)')
            .contains("Submit")
            .click()
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(500)

          // Now on editor
          cy.url().should("include", "/editor")
          cy.get("button.editor-save").contains("Save").scrollIntoView()
          cy.get("button.editor-save").contains("Save").click()

          // Group choice modal
          cy.contains("Who owns this?")
          cy.get("div[data-testid='group-choice-modal'] button")
            .contains("Save")
            .click()

          // Waiting for indexing. If this proves problematic, can try a different approach.
          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(10000)

          // Go back to templates
          cy.get("a").contains("Resource Templates").click()
          cy.url().should("include", "/templates")

          cy.get("#searchInput").should(
            "have.value",
            "resourceTemplate:bf2:WorkTitle"
          )

          // eslint-disable-next-line cypress/no-unnecessary-waiting
          cy.wait(1000)
        })
      }
    })
  })

  it("Opens a resource template", () => {
    cy.get('button[aria-label="Create resource for Work Title"]').last().click()
    cy.url().should("include", "/editor")
  })

  // scrollBehavior: 'center' is to account for the sticky header
  it("Populates a resource template", { scrollBehavior: "center" }, () => {
    // Add a value for the Preferred Title
    cy.get('textarea[placeholder="Preferred Title for Work"]').type(
      `${title}{enter}`
    )
    cy.get('textarea[placeholder="Preferred Title for Work"]').contains(title)
  })

  it("Previews the resource", () => {
    cy.get('button[title="Preview resource"]').first().scrollIntoView()
    cy.get('button[title="Preview resource"]').first().click()

    cy.get("select#format").select("n-triples")
    cy.contains(
      `<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "${title}"@en .`
    )
    cy.contains(
      '<> <http://sinopia.io/vocabulary/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" .'
    )
    cy.contains(
      "<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/Title> ."
    )
  })

  it("Saves", () => {
    cy.get("button.modal-save").scrollIntoView()
    cy.get("button.modal-save").click({ force: true })

    cy.contains("Who owns this?")
    cy.get("div[data-testid='group-choice-modal'] button")
      .contains("Save")
      .click()

    cy.contains("URI for this resource")
    cy.contains("Saved").should("not.exist")
  })

  it("Search", () => {
    // Waiting for indexing. If this proves problematic, can try a different approach.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(10000)

    // Indexing latency is possible problem here.
    // Force is necessary because reflow of search inputs is suboptimal.
    cy.get("input#search").type(`${title}{enter}`, { force: true })

    cy.contains(title)
  })

  it("Open existing resource in editor", () => {
    cy.get("button[title=Edit]").click()
    cy.url().should("include", "/editor")

    cy.contains("h3", "Work Title")
    cy.contains("URI for this resource")
    cy.get(".form-control").contains(title)
  })

  it("Logs out", () => {
    cy.contains("a", "Logout").click()
  })

  it("Logs in again", () => {
    cy.get("#username").type(Cypress.env("COGNITO_TEST_USER_NAME"))
    cy.get("#username").should(
      "have.value",
      Cypress.env("COGNITO_TEST_USER_NAME")
    )
    cy.get("#password").type(Cypress.env("COGNITO_TEST_USER_PASS"))
    cy.get("#password").should(
      "have.value",
      Cypress.env("COGNITO_TEST_USER_PASS")
    )
    cy.get('button[type="submit"]').contains("Login").click()
  })

  it("Retains history", () => {
    // Go back to dashaboard
    cy.contains("a", "Dashboard").click({ force: true })
    cy.url().should("include", "/dashboard")

    cy.contains("h2", "Recent templates")
    cy.get('button[aria-label="Create resource for Work Title"]')

    cy.contains("h2", "Recent searches")
    cy.contains("table.search-list td", title)

    cy.contains("h2", "Recent resources")
    cy.contains("table.resource-list td", title)
  })

  it("Logs out", () => {
    cy.contains("a", "Logout").click({ force: true })
  })
})
