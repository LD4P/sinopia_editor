// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { render } from "@testing-library/react"
import RenderLookupContext from "components/editor/inputs/RenderLookupContext"

/* eslint-disable testing-library/no-node-access */
const contextPersonResult = {
  uri: "http://id.loc.gov/rwo/agents/n79021164",
  id: "n 79021164",
  label: "Twain, Mark, 1835-1910",
  context: [
    {
      property: "Preferred label",
      values: ["Twain, Mark, 1835-1910"],
    },
    {
      group: "Dates",
      property: "Birth date",
      values: ["(edtf) 1835-11-30"],
    },
    {
      property: "Occupation",
      values: ["Lecturers", "Humorists", "Authors"],
    },
  ],
}

const genericResult = {
  uri: "http://id.loc.gov/rwo/agents/n79021164",
  id: "n 79021164",
  label: "Biology",
  context: [
    {
      property: "Preferred label",
      values: ["Biology"],
    },
    {
      property: "Additional Info",
      values: ["Additional Information"],
    },
  ],
}

const discogsResult = {
  uri: "https://api.discogs.com/masters/144098",
  id: "144098",
  label: "Frank Sinatra",
  context: [
    {
      property: "Image URL",
      values: ["https://imageurl.jpg"],
    },
    {
      property: "Year",
      values: ["1963"],
    },
    {
      property: "Record Labels",
      values: ["Reprise Records"],
    },
    {
      property: "Formats",
      values: ["Vinyl"],
    },
    {
      property: "Type",
      values: ["master"],
    },
  ],
}

const genreResult = {
  uri: "http://id.loc.gov/authorities/genreForms/gf2011026181",
  id: "gf2011026181",
  label: "Cutout animation films",
  context: [
    {
      property: "Broader",
      values: [
        {
          uri: "http://id.loc.gov/authorities/genreForms/gf2011026049",
          id: "gf2011026049",
          label: "Animated films",
        },
      ],
    },
  ],
}

const plProps = {
  authURI: "urn:ld4p:qa:names:person",
  authLabel: "LOC person [names] (QA)",
  innerResult: contextPersonResult,
}

const p2Props = {
  authURI: "urn:generic",
  authLabel: "Lookups",
  innerResult: genericResult,
}

const p3Props = {
  authURI: "urn:discogs",
  authLabel: "Discogs",
  innerResult: discogsResult,
}

const p4Props = {
  authURI: "urn:ld4p:qa:genres",
  authLabel: "LOC Genre Forms",
  innerResult: genreResult,
}

describe("<RenderLookupContext />", () => {
  it("displays label and additional context with order specified", () => {
    render(<RenderLookupContext {...plProps} />)

    const detailsContainer = document.querySelectorAll(".details-container")
    expect(detailsContainer.length).toEqual(3)
    const label = detailsContainer[0]
    expect(label).toHaveTextContent("Twain, Mark, 1835-1910")
    const dateDetails = detailsContainer[1]
    expect(dateDetails.querySelector(".context-field")).toHaveTextContent(
      "Birth date"
    )
    expect(dateDetails).toHaveTextContent("(edtf) 1835-11-30")
    const details = detailsContainer[2]
    expect(details.querySelector(".context-field")).toHaveTextContent(
      "Occupation"
    )
    expect(details).toHaveTextContent("Lecturers, Humorists, Authors")
  })

  it("displays label additional context when no order specified for context values for that authority", () => {
    render(<RenderLookupContext {...p2Props} />)

    const genericContainer = document.querySelectorAll(".details-container")
    expect(genericContainer.length).toEqual(2)
    const genericLabel = genericContainer[0]
    expect(genericLabel).toHaveTextContent("Biology")
    const genericDetails = genericContainer[1]
    expect(genericDetails.querySelector(".context-field")).toHaveTextContent(
      "Additional Info"
    )
    expect(genericDetails).toHaveTextContent("Additional Information")
  })

  it("displays discogs label and context", () => {
    render(<RenderLookupContext {...p3Props} />)

    expect(document.querySelector("img")).toHaveAttribute(
      "src",
      "https://imageurl.jpg"
    )
    const discogsDetailsContainers =
      document.querySelectorAll(".details-container")
    expect(discogsDetailsContainers[0]).toHaveTextContent("Frank Sinatra")
    expect(discogsDetailsContainers[0]).toHaveTextContent("(1963)")
    expect(discogsDetailsContainers[2]).toHaveTextContent("Reprise Records")
    expect(discogsDetailsContainers[1]).toHaveTextContent("Vinyl")
    expect(discogsDetailsContainers[3]).toHaveTextContent("Master")
  })

  it("displays nested object label", () => {
    render(<RenderLookupContext {...p4Props} />)
    const genreContainer = document.querySelectorAll(".details-container")
    const genreDetails = genreContainer[1]
    expect(genreDetails.querySelector(".context-field")).toHaveTextContent(
      "Broader"
    )
    expect(genreDetails).toHaveTextContent("Animated films")
  })
})
