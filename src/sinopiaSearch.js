// Copyright 2019 Stanford University see LICENSE for license
import Config from './Config'
/* eslint-disable node/no-unpublished-import */
import {
  getFixtureTemplateSearchResults, hasFixtureResource, resourceSearchResults,
} from '../__tests__/testUtilities/fixtureLoaderHelper'
import _ from 'lodash'

/* eslint-enable node/no-unpublished-import */

// Not using ES client because not intended for use in browser.
/**
 * Performs a search of Sinopia resources.
 * @param {string} query
 * @param {Object} options for the search (resultsPerPage, startOfRange, sortField, sortOrder, typeFilter)
 * @return {Promise<Object>} promise containing the result of the search.
 */
export const getSearchResults = async (query, options = {}) => getSearchResultsWithFacets(query, { ...options, noFacetResults: true })
  .then(([results]) => results)

/**
 * Performs a search of Sinopia resources.
 * @param {string} query
 * @param {Object} options for the search (resultsPerPage, queryFrom, sortField, sortOrder, typeFilter, noFacetResults)
 * @return {Promise<Object>} promise containing the result of the search.
 */
export const getSearchResultsWithFacets = async (query, options = {}) => {
  if (Config.useResourceTemplateFixtures && hasFixtureResource(query)) return Promise.resolve(resourceSearchResults(query))

  const body = {
    query: {
      bool: {
        must: {
          simple_query_string: {
            fields: ['title^3', 'subtitle^2', 'uri^3', 'text'],
            default_operator: 'AND',
            query,
          },
        },
      },
    },
    from: options.startOfRange || 0,
    size: options.resultsPerPage || Config.searchResultsPerPage,
    sort: sort(options.sortField, options.sortOrder),
  }
  const termsFilters = []
  if (options.typeFilter) {
    termsFilters.push({ terms: { type: Array.isArray(options.typeFilter) ? options.typeFilter : [options.typeFilter] } })
  }
  if (options.groupFilter) {
    termsFilters.push({ terms: { group: Array.isArray(options.groupFilter) ? options.groupFilter : [options.groupFilter] } })
  }
  if (!_.isEmpty(termsFilters)) body.query.bool.filter = termsFilters

  if (!options.noFacetResults) {
    body.aggs = {
      types: {
        terms: {
          field: 'type',
        },
      },
      groups: {
        terms: {
          field: 'group',
        },
      },
    }
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
        return [{
          totalHits: 0,
          results: [],
          error: json.error.reason || json.error,
        }, undefined]
      }
      return [hitsToResult(json.hits), aggregationsToResult(json.aggregations)]
    })
    .catch((err) => [{
      totalHits: 0,
      results: [],
      error: err.toString(),
    }, undefined])
}

const hitsToResult = (hits) => (
  {
    totalHits: hits.total.value,
    results: hits.hits.map((row) => ({
      uri: row._source.uri,
      label: row._source.label,
      created: row._source.created,
      modified: row._source.modified,
      type: row._source.type,
      group: row._source.group,
    })),
  }
)

const aggregationsToResult = (aggs) => {
  if (!aggs) return undefined
  const result = {}
  Object.keys(aggs).forEach((field) => {
    result[field] = aggs[field].buckets
  })
  return result
}

export const getTemplateSearchResults = async (query, options = {}) => {
  if (Config.useResourceTemplateFixtures) {
    const results = await getFixtureTemplateSearchResults()
    return {
      totalHits: results.length,
      results,
      error: undefined,
    }
  }

  const fields = ['id', 'resourceLabel', 'resourceURI', 'remark', 'author']
  const should = fields.map((field) => ({ wildcard: { [field]: { value: `*${query}*` } } }))
  const body = {
    query: {
      bool: {
        should,
      },
    },
    sort: sort('resourceLabel'),
    size: Config.templateSearchResultsPerPage,
    from: options.startOfRange || 0,
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
        totalHits: json.hits.total.value,
        results: json.hits.hits.map((row) => row._source),
        error: undefined,
      }
    })
    .catch((err) => ({
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

export const getLookupResults = (query, lookupConfigs) => lookupConfigs.map(
  (lookupConfig) => getSearchResults(query, { typeFilter: lookupConfig.type, resultsPerPage: 8 })
    .then((result) => {
      if (result) {
        result.authLabel = lookupConfig.label
        result.authURI = lookupConfig.uri
        result.label = lookupConfig.label
        result.id = lookupConfig.uri
      }
      return result
    }),
)
