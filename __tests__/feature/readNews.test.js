// Copyright 2020 Stanford University see LICENSE for license

import { renderApp } from "testUtils"
import { screen } from "@testing-library/react"

describe("reading the latest Sinopia news items", () => {
  it("displays a div containing the latest news, version of Sinopia, link to github site, and a static text list", async () => {
    const { container } = renderApp()
    await screen.findByText("Latest news")
    await screen.findByText(/Sinopia Version \d+\.\d+\.\d+ highlights/)
    screen.getByText("Sinopia help site", { selector: "a" })
    expect(container.querySelectorAll("li").length).not.toBeLessThan(1)
  })
})
