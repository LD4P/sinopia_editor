import { renderApp } from "testUtils"
import { fireEvent, screen } from "@testing-library/react"
import { featureSetup, resourceHeaderSelector } from "featureUtils"

featureSetup()

describe("loading RDF with unused triples", () => {
  it("opens the resource and displays unused triples", async () => {
    renderApp()

    fireEvent.click(screen.getByText("Linked Data Editor", { selector: "a" }))
    fireEvent.click(screen.getByText("Load RDF", { selector: "a" }))

    screen.getByText("Load RDF into Editor")

    const rdf = `
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@en .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
<> <http://foo/bar/mainTitle> "bar"@en .
    `

    fireEvent.change(
      screen.getByLabelText(
        "RDF (Accepts JSON-LD, Turtle, TriG, N-Triples, N-Quads, and Notation3 (N3))"
      ),
      { target: { value: rdf } }
    )
    fireEvent.click(screen.getByText("Submit"))

    await screen.findByText("Abbreviated Title", {
      selector: resourceHeaderSelector,
    })

    screen.getByText(/Unable to load the entire resource/)

    // Switch to turtle
    fireEvent.change(screen.getByLabelText(/Format/), {
      target: { value: "turtle" },
    })

    await screen.findByText('<> <http://foo/bar/mainTitle> "bar"@en.')
  })
})
