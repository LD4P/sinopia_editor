// Copyright 2019 Stanford University see LICENSE for license

import { fetchLookup } from "actionCreators/lookups"
import configureMockStore from "redux-mock-store"
import thunk from "redux-thunk"
import { nanoid } from "nanoid"
import "isomorphic-fetch"
import { createState } from "stateUtils"

const mockStore = configureMockStore([thunk])

jest.mock("nanoid")
nanoid.mockReturnValue("abc123")

const uri = "https://id.loc.gov/vocabulary/carriers"
// Note that this has a duplicate to test de-duping.
// For some reason, some authorities have dupes.
const carriers = [
  {
    "@id": "http://id.loc.gov/vocabulary/carriers/nn",
    "@type": ["http://www.loc.gov/mads/rdf/v1#Authority"],
    "http://www.loc.gov/mads/rdf/v1#authoritativeLabel": [
      {
        "@value": "flipchart",
      },
    ],
  },
  {
    "@id": "http://id.loc.gov/vocabulary/carriers/nn",
    "@type": ["http://www.loc.gov/mads/rdf/v1#Authority"],
    "http://www.loc.gov/mads/rdf/v1#authoritativeLabel": [
      {
        "@value": "flipchart",
      },
    ],
  },
  {
    "@id": "http://id.loc.gov/vocabulary/carriers/nz",
    "@type": ["http://www.loc.gov/mads/rdf/v1#Authority"],
    "http://www.loc.gov/mads/rdf/v1#authoritativeLabel": [
      {
        "@value": "other unmediated carrier",
      },
    ],
  },
  {
    "@id": "_:b248idlocgovvocabularycarriers",
    "@type": ["http://purl.org/vocab/changeset/schema#ChangeSet"],
    "http://purl.org/vocab/changeset/schema#subjectOfChange": [
      {
        "@id": "http://id.loc.gov/vocabulary/carriers",
      },
    ],
    "http://purl.org/vocab/changeset/schema#creatorName": [
      {
        "@id": "dlc",
      },
    ],
    "http://purl.org/vocab/changeset/schema#createdDate": [
      {
        "@type": "http://www.w3.org/2001/XMLSchema#dateTime",
        "@value": "2014-01-23T00:00:00",
      },
    ],
    "http://purl.org/vocab/changeset/schema#changeReason": [
      {
        "@type": "http://www.w3.org/2001/XMLSchema#string",
        "@value": "new",
      },
    ],
  },
]

describe("fetchLookup", () => {
  it("fetches the lookup, transforms it, and adds to state", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ json: () => carriers }))

    const store = mockStore(createState())
    await store.dispatch(fetchLookup(uri))

    const actions = store.getActions()
    const lookup = [
      {
        id: "abc123",
        label: "flipchart",
        uri: "http://id.loc.gov/vocabulary/carriers/nn",
      },
      {
        id: "abc123",
        label: "other unmediated carrier",
        uri: "http://id.loc.gov/vocabulary/carriers/nz",
      },
    ]
    expect(actions).toEqual([
      {
        type: "LOOKUP_OPTIONS_RETRIEVED",
        payload: { uri, lookup },
      },
    ])
  })

  it("handles fetch error and adds to state", async () => {
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.reject(new Error("fail")))

    const store = mockStore(createState())
    await store.dispatch(fetchLookup(uri))

    const actions = store.getActions()
    const lookup = [
      {
        isError: true,
      },
    ]
    expect(actions).toEqual([
      {
        type: "LOOKUP_OPTIONS_RETRIEVED",
        payload: { uri, lookup },
      },
    ])
  })
})
