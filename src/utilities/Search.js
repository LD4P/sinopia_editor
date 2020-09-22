// Copyright 2020 Stanford University see LICENSE for license

import shortid from 'shortid'
import Config from 'Config'

export const getQAOptions = (results) => getOptions(results, (result) => result.body.results)
export const getSinopiaOptions = (results) => getOptions(results, (result) => result.results)

const getOptions = (results, getResults) => {
  const options = []
  results.forEach((result) => {
    const authLabel = result.authLabel
    const authURI = result.authURI
    options.push({
      authURI,
      authLabel,
      label: authLabel,
    })
    if (result.isError) {
      options.push({
        isError: true,
        label: result.errorObject.message,
        id: shortid.generate(),
      })
      return
    }
    getResults(result).forEach((option) => {
      options.push(option)
    })
  })
  return options
}

export const defaultSearchResultsPerPage = (searchType) => (searchType === 'template' ? Config.templateSearchResultsPerPage : Config.searchResultsPerPage)
