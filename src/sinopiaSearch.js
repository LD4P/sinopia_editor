// Copyright 2019 Stanford University see LICENSE for license
import Config from './Config'
/* eslint-disable node/no-unpublished-import */
import { resourceTemplateSearchResults } from '../__tests__/fixtureLoaderHelper'
/* eslint-enable node/no-unpublished-import */

// Not using ES client because not intended for use in browser.
// eslint-disable-next-line max-params
export const getSearchResults = async (query, queryFrom = 0, size = Config.searchResultsPerPage, sortField, sortOrder) => {
  const body = {
    query: {
      simple_query_string: {
        fields: ['title^3', 'subtitle^2', 'uri^3', 'text'],
        default_operator: 'AND',
        query,
      },
    },
    from: queryFrom,
    size,
    sort: sort(sortField, sortOrder),
  }
  const url = `${Config.searchHost}${Config.searchPath}`

  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((resp) => {
      if (resp.status >= 300) {
        return {
          totalHits: 0,
          results: [],
          error: `${resp.status}: ${resp.statusText}`,
        }
      }
      return resp.json()
    })
    .then((json) => {
      if (json.error) {
        return {
          totalHits: 0,
          results: [],
          error: json.error.reason || json.error,
        }
      }
      return {
        totalHits: json.hits.total,
        results: json.hits.hits.map(row => ({
          uri: row._id,
          label: row._source.label,
          created: row._source.created,
          modified: row._source.modified,
          type: row._source.type,
        })),
      }
    })
    .catch(err => ({
      totalHits: 0,
      results: [],
      error: err.toString(),
    }))
}

export const getTemplateSearchResults = async (query) => {
  // When using fixtures, always return all RTs.
  if (Config.useResourceTemplateFixtures) { return {
    totalHits: resourceTemplateSearchResults.length,
    results: resourceTemplateSearchResults,
    error: undefined,
  } }

  const fields = ['id', 'resourceLabel', 'resourceURI', 'remark', 'author']
  const should = fields.map(field => ({ wildcard: { [field]: { value: `*${query}*` } } }))
  const body = {
    query: {
      bool: {
        should,
      },
    },
    sort: sort('resourceLabel'),
    size: Config.templateSearchResultsPerPage,
  }

  const url = `${Config.searchHost}${Config.templateSearchPath}`
  return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    .then((resp) => {
      if (resp.status >= 300) {
        return {
          totalHits: 0,
          results: [],
          error: `${resp.status}: ${resp.statusText}`,
        }
      }
      return resp.json()
    })
    .then((json) => {
      if (json.error) {
        return {
          totalHits: 0,
          results: [],
          error: json.error.reason || json.error,
        }
      }
      return {
        totalHits: json.hits.total,
        results: json.hits.hits.map(row => row._source),
        error: undefined,
      }
    })
    .catch(err => ({
      totalHits: 0,
      results: [],
      error: err.toString(),
    }))
}

const sort = (sortField, sortOrder) => {
  if (sortField === undefined) {
    return ['_score']
  }

  return [{ [sortField]: sortOrder || 'asc' }]
}
