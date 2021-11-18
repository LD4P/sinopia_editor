import { createLookupPromise } from "utilities/QuestioningAuthority"
import { getLookupResult as getSinopiaSearchLookupResult } from "sinopiaSearch"

export const getLookupResult = (query, authorityConfig, startOfRange) => {
  if (authorityConfig.uri.startsWith("urn:ld4p:sinopia"))
    return getSinopiaLookupResult(query, authorityConfig, { startOfRange })
  return getQALookupResult(query, authorityConfig, { startOfRange })
}

const getSinopiaLookupResult = (query, authorityConfig, options) =>
  getSinopiaSearchLookupResult(query, authorityConfig, options).then(
    (result) => ({
      ...authorityConfig,
      error: result.error,
      totalHits: result.totalHits,
      results: adaptSinopiaResults(result.results),
    })
  )

// Adapt Sinopia results to QA format
const adaptSinopiaResults = (results) =>
  results.map((result) => ({
    uri: result.uri,
    id: result.uri,
    label: result.label || result.resourceLabel,
    context: sinopiaContext(result),
  }))

const sinopiaContext = (result) => {
  const context = [
    { property: "ID", values: [result.uri] },
    { property: "Group", values: [result.group] },
  ]
  if (result.type) context.push({ property: "Class", values: result.type })
  if (result.modified)
    context.push({ property: "Modified", values: [result.modified] })
  if (result.resourceURI)
    context.push({ property: "Resource URI", values: [result.resourceURI] })
  if (result.author)
    context.push({ property: "Author", values: [result.author] })
  if (result.date) context.push({ property: "Date", values: [result.date] })
  if (result.remark)
    context.push({ property: "Remark", values: [result.remark] })
  return context
}

const getQALookupResult = (query, authorityConfig, options) =>
  createLookupPromise(query, authorityConfig, options).then((response) => {
    if (response.isError) return { error: response.errorObject.message }
    const totalRecords = response.response_header.total_records
    return {
      authorityConfig,
      results: response.results,
      // Some QA authorities return total_records like 'NOT_REPORTED'.
      // This may need more sophisticated handling in future.
      totalHits: Number.isInteger(totalRecords)
        ? totalRecords
        : response.results.length,
    }
  })

export const noop = () => {}
