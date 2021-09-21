import { createLookupPromise } from "utilities/QuestioningAuthority"
import { getLookupResult as getSinopiaSearchLookupResult } from "sinopiaSearch"

export const getLookupResult = (query, authorityConfig, startOfRange) => {
  if (authorityConfig.uri.startsWith("urn:ld4p:sinopia"))
    return getSinopiaLookupResult(query, authorityConfig, { startOfRange })
  return getQALookupResult(query, authorityConfig, { startOfRange })
}

const getSinopiaLookupResult = (query, authorityConfig, options) =>
  getSinopiaSearchLookupResult(query, authorityConfig, options).then(
    (result) => ({ ...result, authorityConfig })
  )

const getQALookupResult = (query, authorityConfig, options) =>
  createLookupPromise(query, authorityConfig, options).then((response) => {
    if (response.isError) return { error: response.errorObject.message }
    const totalRecords = response.body.response_header.total_records
    return {
      authorityConfig,
      results: response.body.results,
      // Some QA authorities return total_records like 'NOT_REPORTED'.
      // This may need more sophisticated handling in future.
      totalHits: Number.isInteger(totalRecords)
        ? totalRecords
        : response.body.results.length,
    }
  })

export const noop = () => {}
