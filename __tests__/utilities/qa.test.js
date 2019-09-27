// Copyright 2019 Stanford University see LICENSE for license

import getSearchResults from 'utilities/qa'

describe('getSearchResults()', () => {
  it('returns an array of promises from a search', async () => {
    expect.assertions(2)

    const template = {
      valueConstraint: {
        useValuesFrom: [
          'urn:ld4p:qa:agrovoc',
        ],
      },
    }

    const results = getSearchResults('Corn', template)
    expect(results.length).toEqual(1)

    const result = await results[0]
    expect(result.body.length).toEqual(8)
  })

  it('returns a single value using a bad authority source', async () => {
    expect.assertions(1)

    const badAuthorityURItemplate = {
      valueConstraint: {
        useValuesFrom: [
          'urn:ld4p:qa:names:organization',
        ],
      },
    }

    const results = getSearchResults('Austin, Jane', badAuthorityURItemplate)
    const result = await results[0]
    expect(result.isError).toEqual(true)
  })
})
