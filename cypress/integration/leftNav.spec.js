describe("Left-nav test", () => {
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
    cy.get("#username")
      .type(Cypress.env("COGNITO_TEST_USER_NAME"))
      .should("have.value", Cypress.env("COGNITO_TEST_USER_NAME"))
    cy.get("#password")
      .type(Cypress.env("COGNITO_TEST_USER_PASS"))
      .should("have.value", Cypress.env("COGNITO_TEST_USER_PASS"))
    cy.get('button[type="submit"]').contains("Login").click()
  })

  it("Opens Linked Data Editor", () => {
    cy.contains("a", "Linked Data Editor").scrollIntoView().click()
    cy.url().should("include", "/dashboard")

    cy.contains("a", "Resource Templates").click()
    cy.url().should("include", "/templates")
  })

  it("Uploads resource templates", () => {
    cy.get("#searchInput").type("resourceTemplate:testing:uber1")
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)

    // Need to determine if should upload a resource template.
    cy.get("#resource-templates").then((rtDiv) => {
      if (rtDiv.find("div#no-rt-warning").length > 0) {
        addResourceTemplate(
          "uber_template1.txt",
          "http://localhost:3000/resource/resourceTemplate:testing:uber1"
        )
        addResourceTemplate(
          "uber_template2.txt",
          "http://localhost:3000/resource/resourceTemplate:testing:uber2"
        )
        addResourceTemplate(
          "uber_template3.txt",
          "http://localhost:3000/resource/resourceTemplate:testing:uber3"
        )
        addResourceTemplate(
          "uber_template4.txt",
          "http://localhost:3000/resource/resourceTemplate:testing:uber4"
        )

        // Waiting for indexing. If this proves problematic, can try a different approach.
        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(10000)

        // Go back to templates
        cy.get("a").contains("Resource Templates").click()
        cy.url().should("include", "/templates")

        cy.get("#searchInput").should(
          "have.value",
          "resourceTemplate:testing:uber1"
        )

        // eslint-disable-next-line cypress/no-unnecessary-waiting
        cy.wait(1000)
      }
    })
  })

  it("Opens a resource template", () => {
    cy.get('button[aria-label="Create resource for Uber template1"]')
      .first()
      .scrollIntoView()
      .click({ force: true })
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(1000)
    cy.url().should("include", "/editor")
  })

  it(
    "Displays child nav when expanding nav",
    { scrollBehavior: "center" },
    () => {
      cy.get(".left-nav-header").should("not.contain", "Uber template2")
      cy.get(".left-nav-header").should("not.contain", "Uber template3")
      cy.get(".left-nav-header").should(
        "not.contain",
        "Uber template2, property1"
      )

      cy.get(
        'button[aria-label="Show navigation for Uber template1, property1"]'
      ).click()

      cy.get(".left-nav-header").should("contain", "Uber template2")
      cy.get(".left-nav-header").should("contain", "Uber template3")
      cy.get(".left-nav-header").should(
        "not.contain",
        "Uber template2, property1"
      )

      cy.get('button[aria-label="Show navigation for Uber template2"]').click()
      cy.get(".left-nav-header").should("contain", "Uber template2, property1")
    }
  )

  it(
    "Hides child nav when contracting nav",
    { scrollBehavior: "center" },
    () => {
      cy.get('button[aria-label="Hide navigation for Uber template2"]').click()
      cy.get(".left-nav-header").should("contain", "Uber template2")
      cy.get(".left-nav-header").should("contain", "Uber template3")
      cy.get(".left-nav-header").should(
        "not.contain",
        "Uber template2, property1"
      )

      cy.get(
        'button[aria-label="Hide navigation for Uber template1, property1"]'
      ).click()
      cy.get(".left-nav-header").should("not.contain", "Uber template2")
      cy.get(".left-nav-header").should("not.contain", "Uber template3")
      cy.get(".left-nav-header").should(
        "not.contain",
        "Uber template2, property1"
      )
    }
  )

  it(
    "Pops up tooltips for properties with remarks",
    { scrollBehavior: "center" },
    () => {
      // Verifies that tooltip pops up when clicked and hides when something else is clicked
      const tooltipText = "Multiple nested, repeatable resource templates."
      cy.get("body").should("not.contain", tooltipText)
      cy.get('a[data-testid="Uber template1, property1"]')
        .scrollIntoView()
        .click({ force: true })
      // Tooltip appears when clicked
      cy.get("body").should("contain", tooltipText)
      // And disappears when anything else is clicked
      cy.get('button[aria-label="Go to Uber template1, property1"]').click()
      cy.get("body").should("not.contain", tooltipText)
      // Clicks tooltip for property at the bottom of the page
      cy.get('a[data-testid="Uber template1, property20"]')
        .scrollIntoView()
        .click()
      // Ensure the viewport didn't shift to the top of the package
      cy.get('a[data-testid="Uber template1, property20"]').should("be.visible")
    }
  )

  it("Marks properties with errors", { scrollBehavior: "center" }, () => {
    cy.get(".left-nav-header.text-danger").should("not.exist")
    cy.get("button.editor-save").first().scrollIntoView().click({ force: true })
    cy.get(".left-nav-header.text-danger").should(
      "contain",
      "Uber template1, property4"
    )
  })

  it(
    "Fixing error removes marking as error",
    { scrollBehavior: "center" },
    () => {
      cy.get('textarea[placeholder="Uber template1, property4"]').type(
        "bar{enter}",
        { force: true }
      )
      cy.get(".left-nav-header.text-danger").should(
        "not.contain",
        "Uber template1, property4"
      )
    }
  )

  it("Highlights nav when panel clicked", { scrollBehavior: "center" }, () => {
    cy.get("button.current .left-nav-header").should(
      "not.contain",
      "Uber template1, property6"
    )
    cy.contains("button", "Uber template1, property6").click({ force: true })
    cy.get("button.current .left-nav-header").should(
      "contain",
      "Uber template1, property6"
    )
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

  it("Logs out", () => {
    cy.contains("a", "Logout").click({ force: true })
  })
})

const addResourceTemplate = (fixture, fixtureUri) => {
  cy.get("a").contains("Load RDF").scrollIntoView().click({ force: true })
  cy.url().should("include", "/load")
  cy.contains("Load RDF into Editor")
  cy.fixture(fixture).then((json) => {
    // Type is to slow. See https://github.com/cypress-io/cypress/issues/1123
    cy.get("#resourceTextArea").paste(json)
    // .type(json, {delay: 0})
    cy.get("#uriInput").type(fixtureUri)
    cy.get('button[type="submit"]:not(:disabled)')
      .contains("Submit")
      .scrollIntoView()
      .click()
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(500)

    // Now on editor
    cy.url().should("include", "/editor")
    cy.get("button.editor-save")
      .contains("Save")
      .scrollIntoView()
      .click({ force: true })

    // Group choice modal
    cy.contains("Who owns this?")
    cy.get("div[data-testid='group-choice-modal'] button")
      .contains("Save")
      .click()
  })
}
