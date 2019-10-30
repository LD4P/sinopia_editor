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
})

describe('getTerm', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ text: () => 'n3' }))
  })

  it('fetches N3 from QA with uri', async () => {
    const term = await getTerm('http://share-vde.org/sharevde/rdfBibframe/Work/4840195', undefined, 'urn:ld4p:qa:sharevde_chicago_ld4l_cache:all')
    expect(term).toBe('n3')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const url = 'https://lookup.ld4l.org/authorities/fetch/linked_data/sharevde_chicago_ld4l_cache?format=n3&uri=http://share-vde.org/sharevde/rdfBibframe/Work/4840195'
    expect(global.fetch).toHaveBeenCalledWith(url)
  })
  it('fetches N3 from QA with id', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ text: () => 'n3' }))

    const term = await getTerm('https://www.discogs.com/Shania-Twain-Shania-Twain/master/132553', '132553', 'urn:discogs:master')
    expect(term).toBe('n3')

    expect(global.fetch).toHaveBeenCalledTimes(1)
    const url = 'https://lookup.ld4l.org/authorities/show/discogs/master/132553?format=n3'
    expect(global.fetch).toHaveBeenCalledWith(url)
  })
})
