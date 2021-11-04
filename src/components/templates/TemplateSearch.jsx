// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef, useState, useCallback } from "react"
import { getTemplateSearchResults } from "sinopiaSearch"
import { useDispatch, useSelector } from "react-redux"
import {
  clearSearchResults as clearSearchResultsAction,
  setSearchResults,
} from "actions/search"
import SinopiaResourceTemplates from "./SinopiaResourceTemplates"
import SearchResultsPaging from "components/search/SearchResultsPaging"
import NewResourceTemplateButton from "./NewResourceTemplateButton"
import {
  selectSearchQuery,
  selectSearchOptions,
  selectSearchTotalResults,
} from "selectors/search"
import { clearErrors, addError } from "actions/errors"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import useAlerts from "hooks/useAlerts"

const TemplateSearch = (props) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()
  // Tokens allow us to cancel an existing search. Does not actually stop the
  // search, but causes result to be ignored.
  const tokens = useRef([])

  const lastQueryString = useSelector((state) =>
    selectSearchQuery(state, "template")
  )
  const searchOptions = useSelector((state) =>
    selectSearchOptions(state, "template")
  )
  const totalResults = useSelector((state) =>
    selectSearchTotalResults(state, "template")
  )

  const [queryString, setQueryString] = useState(lastQueryString || "")
  const [startOfRange, setStartOfRange] = useState(0)

  const clearSearchResults = useCallback(
    () => dispatch(clearSearchResultsAction("template")),
    [dispatch]
  )

  useEffect(() => {
    if (!queryString) clearSearchResults()
  }, [clearSearchResults, queryString])

  useEffect(() => {
    // Cancel all current searches
    while (tokens.current.length > 0) {
      tokens.current.pop().cancel = true
    }

    // Create a token for this set of searches
    const token = { cancel: false }
    tokens.current.push(token)
    getTemplateSearchResults(queryString, { startOfRange }).then((response) => {
      if (!token.cancel) {
        if (queryString !== "") dispatch(clearErrors(errorKey))
        dispatch(
          setSearchResults(
            "template",
            null,
            response.results,
            response.totalHits,
            {},
            queryString,
            { startOfRange },
            response.error
          )
        )
        if (response.error) {
          dispatch(
            addError(
              errorKey,
              `Error searching for templates: ${response.error}`
            )
          )
        }
      }
    })
  }, [dispatch, queryString, startOfRange, errorKey])

  const changePage = (startOfRange) => {
    setStartOfRange(startOfRange)
  }

  const updateSearch = (e) => {
    setStartOfRange(0)
    setQueryString(e.target.value)
  }

  return (
    <React.Fragment>
      <div id="search">
        <div className="row">
          <div className="col-md-10">
            <form
              className="row mb-2 mt-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="input-group">
                <label
                  className="font-weight-bold col-form-label"
                  htmlFor="searchInput"
                >
                  Find a resource template
                </label>
                &nbsp;
                <input
                  id="searchInput"
                  type="text"
                  className="form-control"
                  style={{ marginLeft: "5px" }}
                  onChange={updateSearch}
                  placeholder="Enter id, label, URI, remark, group, or author"
                  value={queryString}
                />
                <span className="input-group-btn">
                  <button
                    className="btn btn-default"
                    type="button"
                    aria-label="Clear query string"
                    title="Clear query string"
                    data-testid="Clear query string"
                    onClick={() => setQueryString("")}
                  >
                    <FontAwesomeIcon className="trash-icon" icon={faTrashAlt} />
                  </button>
                </span>
              </div>
            </form>
          </div>
          <div className="col-md-2">
            <NewResourceTemplateButton history={props.history} />
          </div>
        </div>
      </div>

      <SinopiaResourceTemplates history={props.history} />
      <SearchResultsPaging
        changePage={changePage}
        resultsPerPage={searchOptions.resultsPerPage}
        startOfRange={startOfRange}
        totalResults={totalResults}
      />
    </React.Fragment>
  )
}

TemplateSearch.propTypes = {
  history: PropTypes.object,
}

export default TemplateSearch
