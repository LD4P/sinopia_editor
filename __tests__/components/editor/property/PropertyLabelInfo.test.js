// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"
import PropertyLabelInfo from "components/editor/property/PropertyLabelInfo"

describe("<PropertyLabelInfo />", () => {
  it("displays remark only when no remark URL is present", () => {
    const state = createState({ hasResourceWithNestedResource: true })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1"
      ]
    const label = renderComponent(
      <PropertyLabelInfo propertyTemplate={propertyTemplate} />,
      store
    )
    expect(label.getByRole("link").getAttribute("data-bs-content")).toBe(
      "Nested, repeatable resource template."
    )
    expect(label.getAllByRole("link").length).toBe(1) // only one link present, the remark
  })

  it("displays remark URL only when no remark is present", () => {
    const state = createState({ hasResourceWithTwoNestedResources: true })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "resourceTemplate:testing:uber1 > http://id.loc.gov/ontologies/bibframe/uber/template1/property1"
      ]

    const label = renderComponent(
      <PropertyLabelInfo propertyTemplate={propertyTemplate} />,
      store
    )
    expect(label.getByRole("link").getAttribute("title")).toBe(
      "https://www.stanford.edu"
    )
    expect(label.getAllByRole("link").length).toBe(1) //  only one link present, the remark URL
  })

  it("displays both remark and remark URL when both are present", () => {
    const state = createState({ hasResourceWithTwoNestedResources: true })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "resourceTemplate:testing:uber2 > http://id.loc.gov/ontologies/bibframe/uber/template2/property1"
      ]

    const label = renderComponent(
      <PropertyLabelInfo propertyTemplate={propertyTemplate} />,
      store
    )
    expect(label.getAllByRole("link").length).toBe(2) //  two links present, the remark and the remark URL
  })

  it("displays no links when neither the remark nor the remark URL are present", () => {
    const state = createState({ hasResourceWithLiteral: true })
    const store = createStore(state)
    const propertyTemplate =
      state.entities.propertyTemplates[
        "ld4p:RT:bf2:Title:AbbrTitle > http://id.loc.gov/ontologies/bibframe/mainTitle"
      ]

    const label = renderComponent(
      <PropertyLabelInfo propertyTemplate={propertyTemplate} />,
      store
    )
    expect(label.queryAllByRole("link")).toBeFalsy //  no links present
  })
})
