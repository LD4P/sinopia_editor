// Copyright 2018 Stanford University see LICENSE for license

import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { createStore, renderApp } from "testUtils"
import { featureSetup } from "featureUtils"

featureSetup()

describe("user permissions", () => {
  const uri =
    "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"

  it("does not allow a group-less user to create or edit", async () => {
    const state = createState({ noGroups: true })
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    // No Load RDF tab
    expect(screen.queryByText("Load RDF")).not.toBeInTheDocument()

    // No new template button
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
    await screen.findByText("Uber template1")
    expect(screen.queryByText("New template")).not.toBeInTheDocument()

    // Templates are not linked
    screen.getByText("Uber template1", { selector: "span" })

    // Cannot copy a template
    expect(
      screen.queryByRole("button", { name: "Copy Uber template1" })
    ).not.toBeInTheDocument()
    // Cannot edit a template
    expect(
      screen.queryByRole("button", { name: "Edit Uber template1" })
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Cannot copy a resource
    expect(
      screen.queryByRole("button", { name: `Copy ${uri}` })
    ).not.toBeInTheDocument()
    // Cannot edit a resource
    expect(
      screen.queryByRole("button", { name: `Edit ${uri}` })
    ).not.toBeInTheDocument()

    // Preview the resource
    fireEvent.click(screen.queryByRole("button", { name: `View ${uri}` }))
    await screen.findByText("Preview Resource")
    // Cannot copy a resource
    expect(
      screen.queryByRole("button", { name: "Copy" })
    ).not.toBeInTheDocument()
    // Cannot edit a resource
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument()
  })

  it("allows a user with groups to create or edit", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    // Load RDF tab
    screen.getByText("Load RDF")

    // New template button
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
    await screen.findByText("New template")

    // Templates are linked
    screen.getByTitle("Create resource for Uber template1", { selector: "a" })

    // Can copy a template
    screen.getByRole("button", { name: "Copy Uber template1" })
    // Can edit a template
    screen.getByRole("button", { name: "Edit Uber template1" })

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Can copy a resource
    screen.getByRole("button", { name: `Copy ${uri}` })
    // Can edit a resource
    screen.getByRole("button", { name: `Edit ${uri}` })

    // Preview the resource
    fireEvent.click(screen.queryByRole("button", { name: `View ${uri}` }))
    await screen.findByText("Preview Resource")
    // Can copy a resource
    screen.getByRole("button", { name: "Copy" })
    // Can edit a resource
    screen.getByRole("button", { name: "Edit" })
  })

  it("does not allow a user without edit permissions to edit", async () => {
    const state = createState({ otherGroups: true })
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    // Load RDF tab
    screen.getByText("Load RDF")

    // New template button
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
    await screen.findByText("New template")

    // Templates are linked
    screen.getByTitle("Create resource for Uber template1", { selector: "a" })

    // Can copy a template
    screen.getByRole("button", { name: "Copy Uber template1" })
    // Cannot edit a template
    expect(
      screen.queryByRole("button", { name: "Edit Uber template1" })
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Can copy a resource
    screen.getByRole("button", { name: `Copy ${uri}` })
    // Cannot edit a resource
    expect(
      screen.queryByRole("button", { name: `Edit ${uri}` })
    ).not.toBeInTheDocument()

    // Preview the resource
    fireEvent.click(screen.queryByRole("button", { name: `View ${uri}` }))
    await screen.findByText("Preview Resource")
    // Can copy a resource
    screen.getByRole("button", { name: "Copy" })
    // Cannot edit a resource
    expect(
      screen.queryByRole("button", { name: "Edit" })
    ).not.toBeInTheDocument()
  })
})
