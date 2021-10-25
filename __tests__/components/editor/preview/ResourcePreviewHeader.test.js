// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { render } from "@testing-library/react"
import { createState } from "stateUtils"
import { selectNormSubject } from "selectors/resources"
import configureMockStore from "redux-mock-store"
import ResourcePreviewHeader from "components/editor/preview/ResourcePreviewHeader"
import { Provider } from "react-redux"

const mockStore = configureMockStore()

describe("<ResourcePreviewHeader />", () => {
  it("displays label, url and edit groups", () => {
    const state = createState({ hasTwoLiteralResources: true })
    const store = mockStore(state)
    const resource = selectNormSubject(state, "t9zVwg2zO")
    const header = render(
      <Provider store={store}>
        <ResourcePreviewHeader resource={resource} />
      </Provider>
    )
    expect(header.getByText("Abbreviated Title")).toBeTruthy // label is shown
    expect(header.getByText("Stanford University")).toBeTruthy // owner is shown with full group name
    expect(header.getByText("Cornell University")).toBeTruthy // editable groups are shown with full group name
    expect(header.queryByTestId("expand-groups-button")).not.toBeInTheDocument // expand button is not shown (since there is only edit group to be shown)
    expect(header.getByText(/(https:\/\/api.sinopia.io\/resource\/0894a8b3)/))
      .toBeTruthy // URI is shown
  })
})
