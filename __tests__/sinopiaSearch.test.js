// Copyright 2019 Stanford University see LICENSE for license

import { getSearchResults, getTemplateSearchResults } from 'sinopiaSearch'

describe('getSearchResults', () => {
  const successResult = {
    took: 8,
    timed_out: false,
    _shards: {
      total: 5,
      successful: 5,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 2,
      max_score: 0.2876821,
      hits: [{
        _index: 'sinopia_resources',
        _type: 'sinopia',
        _id: 'repository/cornell/34ef053e-f558-4299-a8a7-c8b79a598d99',
        _score: 0.2876821,
        _source: {
          title: ['foo bar'],
          subtitle: [],
          uri: 'http://platform:8080/repository/cornell/34ef053e-f558-4299-a8a7-c8b79a598d99',
          label: 'foo bar',
          'title-suggest': ['foo', 'bar'],
        },
      }, {
        _index: 'sinopia_resources',
        _type: 'sinopia',
        _id: 'repository/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe',
        _score: 0.2876821,
        _source: {
          title: ['foo'],
          subtitle: [],
          uri: 'http://platform:8080/repository/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe',
          label: 'foo',
          'title-suggest': ['foo'],
        },
      }],
    },
  }

  const errorResult = {
    error: {
      root_cause: [{
        type: 'parsing_exception',
        reason: '[simple_query_string] unsupported field [xdefault_operator]',
        line: 1,
        col: 90,
      }],
      type: 'parsing_exception',
      reason: '[simple_query_string] unsupported field [xdefault_operator]',
      line: 1,
      col: 90,
    },
  }

  it('performs a search with default sort order and returns results', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => successResult }))

    const results = await getSearchResults('foo')
    expect(results).toEqual({
      totalHits: 2,
      results: [
        {
          uri: 'repository/cornell/34ef053e-f558-4299-a8a7-c8b79a598d99',
          label: 'foo bar',
        },
        {
          uri: 'repository/cornell/a96f16c1-a15c-4f4f-8a25-7ed49ba1eebe',
          label: 'foo',
        },
      ],
    })
    const body = {
      query: {
        simple_query_string: {
          fields: ['title^3', 'subtitle^2', 'uri^3', 'text'],
          default_operator: 'AND',
          query: 'foo',
        },
      },
      from: 0,
      size: 10,
      sort: ['_score'],
    }
    expect(global.fetch).toHaveBeenCalledWith('/api/search/sinopia_resources/sinopia/_search', { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
  })

  it('performs a search with specified page and sort order and returns results', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => successResult }))
    await getSearchResults('foo', 10, 15, 'label', 'desc')
    const body = {
      query: {
        simple_query_string: {
          fields: ['title^3', 'subtitle^2', 'uri^3', 'text'],
          default_operator: 'AND',
          query: 'foo',
        },
      },
      from: 10,
      size: 15,
      sort: [{ label: 'desc' }],
    }
    expect(global.fetch).toHaveBeenCalledWith('/api/search/sinopia_resources/sinopia/_search', { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' }, method: 'POST' })
  })


  it('performs a search and handles ES error', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => errorResult }))

    const results = await getSearchResults('foo')
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: '[simple_query_string] unsupported field [xdefault_operator]',
    })
  })

  it('performs a search and handles raised error', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.reject(new Error('Frickin network')))

    const results = await getSearchResults('foo')
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: 'Error: Frickin network',
    })
  })
})

describe('getTemplateSearchResults', () => {
  const trellisDownResult = {
    totalHits: 0,
    results: [],
    error: '504: Gateway Timout',
  }
  it('returns 504 timeout error if Sinopia server is unavailable', async () => {
    global.fetch = jest.fn().mockImplementation(() => Promise.resolve({ json: () => trellisDownResult }))
    const results = await getTemplateSearchResults('Palo Alto')
    expect(results).toEqual({
      totalHits: 0,
      results: [],
      error: '504: Gateway Timout',
    })
  })
})
