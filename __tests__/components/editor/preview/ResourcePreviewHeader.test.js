// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { createStore, renderComponent } from "testUtils"
import { screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { selectNormSubject } from "selectors/resources"
import ResourcePreviewHeader from "components/editor/preview/ResourcePreviewHeader"

describe("<ResourcePreviewHeader />", () => {
  it("displays label, url and edit groups", () => {
    const state = createState({ hasTwoLiteralResources: true })
    const store = createStore(state)
    const resource = selectNormSubject(state, "t9zVwg2zO")
    renderComponent(<ResourcePreviewHeader resource={resource} />, store)
    expect(screen.getByText("Abbreviated Title")).toBeTruthy // label is shown
    expect(screen.getByText("Stanford University")).toBeTruthy // owner is shown with full group name
    expect(screen.getByText("Cornell University")).toBeTruthy // editable groups are shown with full group name
    expect(screen.queryByTestId("expand-groups-button")).not.toBeInTheDocument // expand button is not shown (since there is only edit group to be shown)
    expect(screen.getByText(/(https:\/\/api.sinopia.io\/resource\/0894a8b3)/))
      .toBeTruthy // URI is shown
  })
})
