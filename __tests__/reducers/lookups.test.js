// Copyright 2018 Stanford University see LICENSE for license
import { lookupOptionsRetrieved } from "reducers/lookups"
import { createState } from "stateUtils"

describe("lookupOptionsRetrieved", () => {
  const uri = "https://id.loc.gov/vocabulary/mgroove"
  const lookup = [
    {
      id: "sFdbC6NLsZ",
      label: "Lateral or combined cutting",
      uri: "http://id.loc.gov/vocabulary/mgroove/lateral",
    },
    {
      id: "mDg4LzQtGH",
      label: "Coarse groove",
      uri: "http://id.loc.gov/vocabulary/mgroove/coarse",
    },
  ]

  it("adds a new lookup", () => {
    const newState = lookupOptionsRetrieved(createState().entities, {
      payload: { uri, lookup },
    })
    expect(newState).toMatchObject({
      lookups: {
        [uri]: [
          {
            id: "mDg4LzQtGH",
            label: "Coarse groove",
            uri: "http://id.loc.gov/vocabulary/mgroove/coarse",
          },
          {
            id: "sFdbC6NLsZ",
            label: "Lateral or combined cutting",
            uri: "http://id.loc.gov/vocabulary/mgroove/lateral",
          },
        ],
      },
    })
  })
})
