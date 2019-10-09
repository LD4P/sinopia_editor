// Copyright 2018 Stanford University see LICENSE for license

import setLookup from 'reducers/lookups'

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
    const state = {
      entities: {
        lookups: {},
      },
    }
    const newState = setLookup(state, { payload: { uri, lookup } })
    expect(newState).toEqual({
      entities: {
        lookups: { [uri]: lookup },
      },
    })
  })
})
