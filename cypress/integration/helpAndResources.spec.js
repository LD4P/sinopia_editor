describe("Looking at the Help gutter", () => {
  it("Opens the app", () => {
    cy.visit(Cypress.env("EDITOR_URL") || "http://localhost:8000/")
    cy.contains(
      "The underdrawing for the new world of linked data in libraries"
    )
  })

  it("Opens Help", () => {
    cy.contains("a", "Help").click()

    cy.contains("Sinopia help site")
  })

  it("Closes help", () => {
    cy.get('button[aria-label="Close Help Menu"]').click()

    cy.contains("Sinopia help site")
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
    cy.contains("a", "Linked Data Editor").click()

    cy.url().should("include", "/dashboard")
  })

  it("Opens Help", () => {
    cy.contains("a", "Help").click()

    cy.contains("Sinopia help site")
  })

  it("Closes Help", () => {
    cy.get('button[aria-label="Close Help Menu"]').click()

    cy.contains("Sinopia help site")
  })

  it("Opens Templates", () => {
    cy.contains("a", "Resource Templates").click()

    cy.url().should("include", "/templates")
  })

  it("Opens Help", () => {
    cy.contains("a", "Help").click()

    cy.contains("Sinopia help site")
  })

  it("Closes Help", () => {
    cy.get('button[aria-label="Close Help Menu"]').click()

    cy.contains("Sinopia help site")
  })

  it("Opens Load RDF", () => {
    cy.get(".dropdown-toggle").click()
    cy.contains("a", "Load RDF").click()

    cy.url().should("include", "/load")
  })

  it("Opens Help", () => {
    cy.contains("a", "Help").click({ force: true })

    cy.contains("Sinopia help site")
  })

  it("Closes Help", () => {
    cy.get('button[aria-label="Close Help Menu"]').click()

    cy.contains("Sinopia help site")
  })

  it("Opens Exports", () => {
    cy.get(".dropdown-toggle").click()
    cy.contains("a", "Exports").click()

    cy.url().should("include", "/exports")
  })

  it("Opens Help", () => {
    cy.contains("a", "Help").click()

    cy.contains("Sinopia help site")
  })

  it("Closes Help", () => {
    cy.get('button[aria-label="Close Help Menu"]').click()

    cy.contains("Sinopia help site")
  })
})
