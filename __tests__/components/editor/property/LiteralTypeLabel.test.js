// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import { createStore, renderComponent } from "testUtils"
import { screen } from "@testing-library/react"
import { createState } from "stateUtils"
import LiteralTypeLabel from "components/editor/property/LiteralTypeLabel"

describe("<LiteralTypeLabel />", () => {
  it("displays the correct text for unvalidated literal", () => {
    const state = createState({ hasTwoLiteralResources: true })
    const store = createStore(state)

    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    renderComponent(
      <LiteralTypeLabel propertyTemplate={propertyTemplate} />,
      store
    )
    screen.getByText("Enter a literal")
  })

  it("displays the correct text for a type (i.e. integer) validated literal", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasIntegerValidation: true,
    })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    renderComponent(
      <LiteralTypeLabel propertyTemplate={propertyTemplate} />,
      store
    )
    screen.getByText("Enter an integer")
  })

  it("displays the correct text for a regex validated literal", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasRegexVinskyValidation: true,
    })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    renderComponent(
      <LiteralTypeLabel propertyTemplate={propertyTemplate} />,
      store
    )
    screen.getByText('Enter a literal in the form "^Vinsky$"')
  })

  it("displays the correct text for a regex validated literal that is also typed", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasDateTimeValidation: true,
      hasRegexVinskyValidation: true,
    })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    renderComponent(
      <LiteralTypeLabel propertyTemplate={propertyTemplate} />,
      store
    )
    screen.getByText('Enter a date time in the form "^Vinsky$"')
  })
})
