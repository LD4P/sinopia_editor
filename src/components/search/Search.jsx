// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector } from "react-redux"
import PropTypes from "prop-types"
import Header from "../Header"
import SinopiaSearchResults from "./SinopiaSearchResults"
import QASearchResults from "./QASearchResults"
import SearchResultsPaging from "./SearchResultsPaging"
import SearchResultsMessage from "./SearchResultsMessage"
import {
  selectSearchQuery,
  selectSearchUri,
  selectSearchOptions,
  selectSearchTotalResults,
} from "selectors/search"
import { sinopiaSearchUri } from "utilities/authorityConfig"
import useSearch from "hooks/useSearch"
import AlertsContextProvider from "components/alerts/AlertsContextProvider"
import ContextAlert from "components/alerts/ContextAlert"
import { searchErrorKey } from "utilities/errorKeyFactory"
import TemplateGuessSearchResults from "./TemplateGuessSearchResults"

const Search = (props) => {
  const { fetchSearchResults } = useSearch()

  const searchOptions = useSelector((state) =>
    selectSearchOptions(state, "resource")
  )
  const uri = useSelector((state) => selectSearchUri(state, "resource"))
  const queryString = useSelector((state) =>
    selectSearchQuery(state, "resource")
  )
  const totalResults = useSelector((state) =>
    selectSearchTotalResults(state, "resource")
  )

  const changeSearchPage = (startOfRange) => {
    fetchSearchResults(queryString, uri, searchOptions, startOfRange)
  }

  return (
    <AlertsContextProvider value={searchErrorKey}>
      <div id="search">
        <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
        <ContextAlert />
        <TemplateGuessSearchResults />
        {uri === sinopiaSearchUri ? (
          <SinopiaSearchResults />
        ) : (
          <QASearchResults />
        )}
        <SearchResultsPaging
          resultsPerPage={searchOptions.resultsPerPage}
          startOfRange={searchOptions.startOfRange}
          totalResults={totalResults}
          changePage={changeSearchPage}
        />
        <SearchResultsMessage />
      </div>
    </AlertsContextProvider>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
}

export default Search
