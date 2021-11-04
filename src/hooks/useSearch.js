import { useDispatch } from "react-redux"
import {
  fetchSinopiaSearchResults as fetchSinopiaSearchResultsCreator,
  fetchQASearchResults as fetchQASearchResultsCreator,
} from "actionCreators/search"
import { sinopiaSearchUri } from "utilities/authorityConfig"
import { useHistory } from "react-router-dom"

const useSearch = (errorKey) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const fetchQASearchResults = (
    queryString,
    uri,
    searchOptions,
    startOfRange
  ) =>
    dispatch(
      fetchQASearchResultsCreator(queryString, uri, errorKey, {
        ...searchOptions,
        startOfRange,
      })
    )

  const fetchSinopiaSearchResults = (
    queryString,
    searchOptions,
    startOfRange
  ) =>
    dispatch(
      fetchSinopiaSearchResultsCreator(
        queryString,
        {
          ...searchOptions,
          startOfRange,
        },
        errorKey
      )
    )

  const fetchSearchResults = (
    queryString,
    uri,
    searchOptions,
    startOfRange
  ) => {
    if (uri === sinopiaSearchUri) {
      return fetchSinopiaSearchResults(queryString, searchOptions, startOfRange)
    }
    return fetchQASearchResults(queryString, uri, searchOptions, startOfRange)
  }

  const fetchNewSearchResults = (queryString, uri, searchOptions = {}) => {
    fetchSearchResults(queryString, uri, searchOptions, 0).then((result) => {
      if (result) history.push("/search")
    })
  }

  return { fetchSearchResults, fetchNewSearchResults }
}

export default useSearch
