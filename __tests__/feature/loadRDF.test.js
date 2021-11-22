import { renderApp } from "testUtils"
import { fireEvent, waitFor, screen } from "@testing-library/react"
import * as sinopiaSearch from "sinopiaSearch"
import { featureSetup } from "featureUtils"

featureSetup({ noMockSinopiaApi: true })
jest.mock("sinopiaSearch")

describe("loading from RDF", () => {
  describe("when RDF", () => {
    it("opens the resource", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      const rdf = `
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(
        screen.getByLabelText(
          "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
        ),
        { target: { value: rdf } }
      )
      fireEvent.click(screen.getByText("Submit", { selector: "button" }))

      expect(
        (await screen.findAllByText("Abbreviated Title", { selector: "h3" }))
          .length
      ).toBeTruthy()

      screen.getByText("foo")
    })
  })

  describe("when RDF with base URI", () => {
    it("opens the resource", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      const rdf = `
<http://sinopia/c73d2fa9> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<http://sinopia/c73d2fa9> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<http://sinopia/c73d2fa9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(
        screen.getByLabelText(
          "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
        ),
        { target: { value: rdf } }
      )
      fireEvent.change(
        screen.getByLabelText(
          "Base URI (Omit brackets. If base URI is <>, leave blank.)"
        ),
        {
          target: { value: "http://sinopia/c73d2fa9" },
        }
      )
      fireEvent.click(screen.getByText("Submit", { selector: "button" }))

      expect(
        (await screen.findAllByText("Abbreviated Title", { selector: "h3" }))
          .length
      ).toBeTruthy()

      screen.getByText("foo")
    })
  })

  describe("when RDF with base URI but base URI not provided", () => {
    it("displays error", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      const rdf = `
<http://sinopia/c73d2fa9> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<http://sinopia/c73d2fa9> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<http://sinopia/c73d2fa9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(
        screen.getByLabelText(
          "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
        ),
        { target: { value: rdf } }
      )
      fireEvent.click(screen.getByText("Submit", { selector: "button" }))

      await screen.findByText("Base URI must be provided.")
    })
  })

  describe("when RDF without resource template provided", () => {
    sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
      totalHits: 1,
      results: [
        {
          id: "ld4p:RT:bf2:Title:AbbrTitle",
          resourceLabel: "Abbreviated Title",
          resourceURI: "http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle",
        },
      ],
      error: undefined,
    })

    it("asks for the resource template id", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      const rdf = `
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(
        screen.getByLabelText(
          "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
        ),
        { target: { value: rdf } }
      )
      fireEvent.click(screen.getByText("Submit", { selector: "button" }))

      await waitFor(() => {
        expect(screen.getByText("Choose resource template")).toBeVisible()
      })

      fireEvent.change(screen.getByPlaceholderText(/Enter id, label/), {
        target: { value: "ld4p:RT:bf2:Title:AbbrTitle" },
      })
      fireEvent.click(await screen.findByText(/Abbreviated Title/))
      fireEvent.click(screen.getByText("Save", { selector: "button" }))

      expect(
        (await screen.findAllByText("Abbreviated Title")).length
      ).toBeTruthy()

      screen.getByText("foo")
    })
  })

  describe("when invalid RDF", () => {
    it("displays error", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      fireEvent.change(
        screen.getByLabelText(
          "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
        ),
        {
          target: { value: "xyz" },
        }
      )
      fireEvent.click(screen.getByText("Submit", { selector: "button" }))

      await screen.findByText(/Error parsing/)
    })
  })

  describe("when no RDF", () => {
    it("disables submit", async () => {
      renderApp()

      fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
      fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

      screen.getByText("Load RDF into Editor")

      const submitBtn = screen.getByText("Submit", { selector: "button" })
      expect(submitBtn).toBeDisabled()
    })
  })
})
