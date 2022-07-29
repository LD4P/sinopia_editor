import React from "react"
import { screen } from "@testing-library/react"
import QASearchResults from "components/search/QASearchResults"
import { createStore, renderComponent } from "testUtils"
import { createState } from "stateUtils"

describe("<QASearchResults />", () => {
  it("renders results", () => {
    const state = createState()
    state.search.resource = {
      results: [
        {
          uri: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
          id: "http://share-vde.org/sharevde/rdfBibframe/Work/3107365",
          label: "These twain",
          context: [
            {
              property: "Title",
              values: ["These twain"],
              selectable: true,
              drillable: false,
            },
            {
              property: "Type",
              values: [
                "http://id.loc.gov/ontologies/bflc/Hub",
                "http://id.loc.gov/ontologies/bibframe/Work",
              ],
              selectable: false,
              drillable: false,
            },
            {
              property: "Contributor",
              values: ["Bennett, Arnold,1867-1931."],
              selectable: false,
              drillable: false,
            },
          ],
        },
        {
          uri: "http://share-vde.org/sharevde/rdfBibframe/Work/3107366",
          id: "http://share-vde.org/sharevde/rdfBibframe/Work/31073656",
          label: "Those twain",
          context: [
            {
              property: "Title",
              values: ["Those twain"],
              selectable: true,
              drillable: false,
            },
            {
              property: "Type",
              values: [
                "http://id.loc.gov/ontologies/bibframe/Text",
                "http://id.loc.gov/ontologies/bibframe/Work",
              ],
              selectable: false,
              drillable: false,
            },
            {
              property: "Contributor",
              values: ["Bennett, Arnold."],
              selectable: false,
              drillable: false,
            },
            {
              property: "Image URL",
              values: [
                "https://img.discogs.com/ilqScil5LIpcF_povstRcaEtEeg=/fit-in/600x527/filters:strip_icc():format(jpeg):mode_rgb():quality(90)/discogs-images/R-1622463-1425003720-8692.jpeg.jpg",
              ],
            },
          ],
        },
      ],
      totalResults: 2,
      query: "twain",
    }

    const store = createStore(state)
    renderComponent(<QASearchResults history={{}} />, store)

    // Headers
    screen.getByText("Label / ID")
    screen.getByText("Class")

    // Rows
    screen.getByText(/These twain/)
    screen.getByText(
      /http:\/\/share-vde.org\/sharevde\/rdfBibframe\/Work\/3107365/
    )
    screen.getByText(/Those twain/)
    screen.getByText("http://id.loc.gov/ontologies/bflc/Hub")
    expect(
      screen.getAllByText("http://id.loc.gov/ontologies/bibframe/Work")
    ).toHaveLength(2)
    expect(
      screen.getAllByText("Contributor", { selector: "strong" })
    ).toHaveLength(2)
    screen.getByText(/Bennett, Arnold,1867-1931./)
    expect(screen.getAllByTitle("Copy")).toHaveLength(2)
  })
})
