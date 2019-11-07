// Copyright 2018 Stanford University see LICENSE for license

import setLookup from 'reducers/lookups'
import { createBlankState } from 'testUtils'

describe('changing the reducer state', () => {
  const uri = 'https://id.loc.gov/vocabulary/mgroove'
  const lookup = [
    {
      id: 'mDg4LzQtGH',
      label: 'Coarse groove',
      uri: 'http://id.loc.gov/vocabulary/mgroove/coarse',
    },
    {
      id: 'sFdbC6NLsZ',
      label: 'Lateral or combined cutting',
      uri: 'http://id.loc.gov/vocabulary/mgroove/lateral',
    },
  ]

  it('adds a new lookup', () => {
    const newState = setLookup(createBlankState().selectorReducer, { payload: { uri, lookup } })
    expect(newState).toMatchObject({
      entities: {
        lookups: { [uri]: lookup },
      },
    })
  })
})
