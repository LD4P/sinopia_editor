// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import { render } from "@testing-library/react"
import { createState } from "stateUtils"
import configureMockStore from "redux-mock-store"
import LiteralTypeLabel from "components/editor/property/LiteralTypeLabel"
import { Provider } from "react-redux"

const mockStore = configureMockStore()

describe("<LiteralTypeLabel />", () => {
  it("displays the correct text for unvalidated literal", () => {
    const state = createState({ hasTwoLiteralResources: true })
    const store = mockStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    const label = render(
      <Provider store={store}>
        <LiteralTypeLabel propertyTemplate={propertyTemplate} />
      </Provider>
    )
    expect(label.getByText("Enter a literal")).toBeInTheDocument
  })

  it("displays the correct text for a type (i.e. integer) validated literal", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasIntegerValidation: true,
    })
    const store = mockStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    const label = render(
      <Provider store={store}>
        <LiteralTypeLabel propertyTemplate={propertyTemplate} />
      </Provider>
    )
    expect(label.getByText("Enter a integer")).toBeInTheDocument
  })

  it("displays the correct text for a regex validated literal", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasRegexVinskyValidation: true,
    })
    const store = mockStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    const label = render(
      <Provider store={store}>
        <LiteralTypeLabel propertyTemplate={propertyTemplate} />
      </Provider>
    )
    expect(label.getByText('Enter a literal in the form "^Vinsky$"'))
      .toBeInTheDocument
  })

  it("displays the correct text for a regex validated literal that is also typed", () => {
    const state = createState({
      hasResourceWithLiteral: true,
      hasDateTimeValidation: true,
      hasRegexVinskyValidation: true,
    })
    const store = mockStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]
    const label = render(
      <Provider store={store}>
        <LiteralTypeLabel propertyTemplate={propertyTemplate} />
      </Provider>
    )
    expect(label.getByText('Enter a date time in the form "^Vinsky$"'))
      .toBeInTheDocument
  })
})
