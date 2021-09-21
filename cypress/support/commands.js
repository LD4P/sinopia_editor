// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// This is used to paste JSON into text area.
// Type is too slow. See See https://github.com/cypress-io/cypress/issues/1123
Cypress.Commands.add(
  "paste",
  {
    prevSubject: true,
    element: true,
  },
  ($element, text) => {
    const subString = text.substr(0, text.length - 1)
    const lastChar = text.slice(-1)

    $element.text(subString)
    $element.val(subString)
    cy.get($element).type(lastChar)
  }
)

// See https://github.com/cypress-io/cypress/issues/877#issuecomment-490504922
Cypress.Commands.add("isNotInViewport", (element) => {
  cy.get(element).then(($el) => {
    const bottom = Cypress.$(cy.state("window")).height()
    const rect = $el[0].getBoundingClientRect()

    expect(rect.top).to.be.greaterThan(bottom)
    expect(rect.bottom).to.be.greaterThan(bottom)
    expect(rect.top).to.be.greaterThan(bottom)
    expect(rect.bottom).to.be.greaterThan(bottom)
  })
})

Cypress.Commands.add("isInViewport", (element) => {
  cy.get(element).then(($el) => {
    const bottom = Cypress.$(cy.state("window")).height()
    const rect = $el[0].getBoundingClientRect()

    expect(rect.top).not.to.be.greaterThan(bottom)
    expect(rect.bottom).not.to.be.greaterThan(bottom)
    expect(rect.top).not.to.be.greaterThan(bottom)
    expect(rect.bottom).not.to.be.greaterThan(bottom)
  })
})

// See https://github.com/cypress-io/cypress/issues/461#issuecomment-392070888
const LOCAL_STORAGE_MEMORY = {}

Cypress.Commands.add("saveLocalStorage", () => {
  Object.keys(localStorage).forEach((key) => {
    LOCAL_STORAGE_MEMORY[key] = localStorage[key]
  })
})

Cypress.Commands.add("restoreLocalStorage", () => {
  Object.keys(LOCAL_STORAGE_MEMORY).forEach((key) => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})
