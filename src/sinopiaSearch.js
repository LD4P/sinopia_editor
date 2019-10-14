// Copyright 2019 Stanford University see LICENSE for license
import Config from './Config'

// Not using ES client because not intended for use in browser.

export const getSearchResults = async (query, queryFrom = 0, size = Config.searchResultsPerPage) => {
  const body = {
    query: {
      simple_query_string: {
        fields: ['title', 'subtitle', 'uri'],
        default_operator: 'AND',
        query,
      },
    },
    from: queryFrom,
    size,
  }
  const url = `${Config.searchHost}${Config.searchPath}`

  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then(resp => resp.json())
    .then((json) => {
      if (json.error) {
        return {
          totalHits: 0,
          results: [],
          error: json.error.reason,
        }
      }
      return {
        totalHits: json.hits.total,
        results: json.hits.hits.map(row => ({
          uri: row._id,
          label: row._source.label,
        })),
      }
    })
    .catch(err => ({
      totalHits: 0,
      results: [],
      error: err.toString(),
    }))
}

// Adding an additional export to avoid a default export.
// This allows for easier mocking in tests.
export const noop = null
