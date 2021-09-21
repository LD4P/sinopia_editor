// Copyright 2020 Stanford University see LICENSE for license

import React from "react"
import { renderComponent } from "testUtils"
import { screen } from "@testing-library/react"
import Vocab from "components/vocabulary/Vocab"

describe("Sinopia Vocabulary", () => {
  it("displays the vocabulary used by Sinopia", async () => {
    // React Router variables that have portions of the URL
    const match = { params: {} }

    renderComponent(<Vocab match={match} />)

    // Search for Heading on page
    await screen.findByText("Vocabulary", { selector: "h1" })

    // Search for specific elements on vocab page
    await screen.findByText("hasAuthor")
  })

  it("displays a dereference element in the Vocabulary", async () => {
    // React Router variables that have portions of the URL
    const match = { params: { element: "hasResourceTemplate" } }

    renderComponent(<Vocab match={match} />)

    // Checks if resolved page has the correct Heading
    await screen.findByText("hasResourceTemplate", { selector: "h1" })
  })

  it("displays a dereferenced element with a subelement", async () => {
    // React Router variables that have portions of the URL
    const match = { params: { element: "propertyType", sub: "resource" } }

    renderComponent(<Vocab match={match} />)

    // Checks if resolved page has the correct Heading
    await screen.findByText("propertyType/resource", { selector: "h1" })
  })

  it("displays error page if the element does not exist", async () => {
    // React Router variables that have portions of the URL
    const match = { params: { element: "garbage" } }

    renderComponent(<Vocab match={match} />)

    // Displays message if the element is not found
    await screen.findByText("garbage not found")
  })
})
