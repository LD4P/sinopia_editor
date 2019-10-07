// Copyright 2019 Stanford University see LICENSE for license

import { getSearchResults, getTerm } from 'utilities/qa'

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

describe('getTerm', () => {
  it('fetches N3 from QA', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ text: () => 'n3' }))

    const term = await getTerm('http://share-vde.org/sharevde/rdfBibframe/Work/4840195', 'urn:ld4p:qa:sharevde_chicago_ld4l_cache:all')
    expect(term).toBe('n3')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const url = 'https://lookup.ld4l.org/authorities/fetch/linked_data/sharevde_chicago_ld4l_cache?format=n3&uri=http://share-vde.org/sharevde/rdfBibframe/Work/4840195'
    expect(global.fetch).toHaveBeenCalledWith(url)
  })
})
