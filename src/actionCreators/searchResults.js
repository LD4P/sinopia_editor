// Copyright 2019 Stanford University see LICENSE for license

import {
  searchStarted, searchFinished, showSearchResults,
} from 'actions/index'
import { getSearchResults } from 'sinopiaServer'

export const retrieveSearchResults = queryString => (dispatch) => {
  dispatch(searchStarted())
  return getSearchResults(queryString)
    .then((response) => {
      dispatch(searchFinished(queryString, response))
      dispatch(showSearchResults(JSON.parse(response)))
    })
}