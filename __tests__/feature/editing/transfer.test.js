import { renderApp, createStore, createHistory } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { createState } from "stateUtils"
import { featureSetup, resourceHeaderSelector } from "featureUtils"
import * as sinopiaApi from "sinopiaApi"
import Config from "Config"

featureSetup()

const bfUri =
  "http://localhost:3000/resource/9c5bd9f5-1804-45bd-99ed-b6e3774c896e"

const nonBfUri =
  "http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f"

jest.spyOn(sinopiaApi, "postTransfer").mockResolvedValue()
jest.spyOn(Config, "transferConfig", "get").mockReturnValue({
  ils: {
    stanford: "Catalog",
  },
})

describe("transfer saved bf:Instance when user belongs to a transfer group", () => {
  it("allows transfer", async () => {
    const state = createState()
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: bfUri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(bfUri)
    fireEvent.click(screen.getByRole("button", { name: `Edit ${bfUri}` }))

    await screen.findByText("The Practitioner's Guide to Graph Data", {
      selector: resourceHeaderSelector,
    })

    const transferBtn = screen.getByText("Export to Catalog")
    fireEvent.click(transferBtn)
    await screen.findByText("Requesting")
  }, 15000)
})

describe("transfer unsaved bf:Instance when user belongs to a transfer group", () => {
  const history = createHistory(["/editor/resourceTemplate:testing:uber1"])
  it("does not allow transfer", async () => {
    renderApp(null, history)

    await screen.findByText("Uber template1", {
      selector: resourceHeaderSelector,
    })

    expect(screen.queryByText("Export to Catalog")).not.toBeInTheDocument()
  }, 10000)
})

describe("transfer saved non-bf:Instance when user belongs to a transfer group", () => {
  it("does not allow transfer", async () => {
    const state = createState()
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: nonBfUri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(nonBfUri)
    fireEvent.click(screen.getByRole("button", { name: `Edit ${nonBfUri}` }))

    await screen.findByText("Example Label", {
      selector: resourceHeaderSelector,
    })

    expect(screen.queryByText("Export to Catalog")).not.toBeInTheDocument()
  }, 10000)
})

describe("transfer saved bf:Instance when user does not belong to a transfer group", () => {
  it("does not allow transfer", async () => {
    const state = createState({ editGroups: true })
    const store = createStore(state)
    renderApp(store)

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))

    fireEvent.change(screen.getByLabelText("Search"), {
      target: { value: bfUri },
    })
    fireEvent.click(screen.getByTestId("Submit search"))

    await screen.findByText(bfUri)
    fireEvent.click(screen.getByRole("button", { name: `Edit ${bfUri}` }))

    await screen.findByText("The Practitioner's Guide to Graph Data", {
      selector: resourceHeaderSelector,
    })

    expect(screen.queryByText("Export to Catalog")).not.toBeInTheDocument()
  }, 10000)
})
