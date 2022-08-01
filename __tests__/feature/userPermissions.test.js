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
    expect(screen.queryByTestId("Copy Uber template1")).not.toBeInTheDocument()
    // Cannot edit a template
    expect(screen.queryByTestId("Edit Uber template1")).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Cannot copy a resource
    expect(screen.queryByTestId(`Copy ${uri}`)).not.toBeInTheDocument()
    // Cannot edit a resource
    expect(screen.queryByTestId(`Edit ${uri}`)).not.toBeInTheDocument()

    // Preview the resource
    fireEvent.click(screen.queryByTestId(`View ${uri}`))
    await screen.findByText("Preview Resource")
    // Cannot copy a resource
    expect(screen.queryByTestId(`Copy ${uri}`)).not.toBeInTheDocument()
    // Cannot edit a resource
    expect(screen.queryByTestId(`Edit ${uri}`)).not.toBeInTheDocument()
  }, 15000)

  it("allows a user with groups to create or edit", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    // Load RDF tab
    screen.getByText("Load RDF")

    // New template button
    fireEvent.click(screen.getByText("Resource Templates", { selector: "a" }))
    await screen.findByText("New template")

    // Can create a new resource
    await screen.findByTestId("Create resource for Uber template1")

    // Can copy a template
    screen.getByTestId("Copy Uber template1")
    // Can edit a template
    screen.getByTestId("Edit Uber template1")

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Can copy a resource
    screen.getByTestId(`Copy ${uri}`)
    // Can edit a resource
    screen.getByTestId(`Edit ${uri}`)

    // Preview the resource
    fireEvent.click(screen.queryByTestId(`View ${uri}`))
    await screen.findByText("Preview Resource")
    // Can copy a resource
    screen.getByTestId(`Copy ${uri}`)
    // Can edit a resource
    screen.getByTestId(`Edit ${uri}`)
  }, 10000)

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

    // Can create a new resource
    await screen.findByTestId("Create resource for Uber template1")

    // Can copy a template
    screen.getByTestId("Copy Uber template1")
    // Cannot edit a template
    expect(screen.queryByTestId("Edit Uber template1")).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: uri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(uri)
    // Can copy a resource
    screen.getByTestId(`Copy ${uri}`)
    // Cannot edit a resource
    expect(screen.queryByTestId(`Edit ${uri}`)).not.toBeInTheDocument()

    // Preview the resource
    fireEvent.click(screen.queryByTestId(`View ${uri}`))
    await screen.findByText("Preview Resource")
    // Can copy a resource
    screen.getByTestId(`Copy ${uri}`)
    // Cannot edit a resource
    expect(screen.queryByTestId(`Edit ${uri}`)).not.toBeInTheDocument()
  }, 10000)
})
