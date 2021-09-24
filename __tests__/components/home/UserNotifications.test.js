// Copyright 2021 Stanford University see LICENSE for license

import React from "react"
import { screen } from "@testing-library/react"
import UserNotifications from "components/home/UserNotifications"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"

describe("<UserNotifications />", () => {
  it("shows a warning if a logged in user is not in any groups", async () => {
    const state = createState({ noGroups: true })
    const store = createStore(state)
    const { container } = renderComponent(<UserNotifications />, store)
    await screen.findByText(/Before you can create/)
    expect(container).not.toBeNull
  })

  it("does not show a warning if a logged in user is in at least one group", async () => {
    const state = createState()
    const store = createStore(state)
    const { container } = renderComponent(<UserNotifications />, store)
    expect(container).toBeNull
  })

  it("does not show a warning if there is no logged in user", async () => {
    const state = createState({ notAuthenticated: true })
    const store = createStore(state)
    const { container } = renderComponent(<UserNotifications />, store)
    expect(container).toBeNull
  })
})
