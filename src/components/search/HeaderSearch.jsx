// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { Popover } from "bootstrap"
import searchConfig from "../../../static/searchConfig.json"
import { sinopiaSearchUri } from "utilities/authorityConfig"
import useSearch from "hooks/useSearch"
import { selectSearchQuery } from "selectors/search"
import useAlerts from "hooks/useAlerts"

const HeaderSearch = () => {
  const [uri, setUri] = useState(sinopiaSearchUri)
  const lastQueryString = useSelector((state) =>
    selectSearchQuery(state, "resource")
  )
  const [query, setQuery] = useState("")
  const popoverRef = useRef()
  const errorKey = useAlerts()
  const {
    fetchNewSearchResults,
    fetchTemplateGuessSearchResults,
    clearTemplateGuessSearchResults,
  } = useSearch(errorKey)

  const options = searchConfig.map((config) => (
    <option key={config.uri} value={config.uri}>
      {config.label}
    </option>
  ))

  useEffect(() => {
    if (lastQueryString) setQuery(lastQueryString)
  }, [lastQueryString])

  useEffect(() => {
    const popover = new Popover(popoverRef.current, {
      content:
        'Sinopia search: use * as wildcard; default operator for multiple terms is AND; use | (pipe) as OR operator; use quotation marks for exact match. For more details see <a href="https://github.com/LD4P/sinopia/wiki/Searching-in-Sinopia">Searching in Sinopia</a>',
      html: true,
    })

    return () => popover.hide
  }, [popoverRef])

  const handleQueryChange = (event) => {
    setQuery(event.target.value)
    event.preventDefault()
  }

  const handleUriChange = (event) => {
    setUri(event.target.value)
    event.preventDefault()
  }

  const runSearch = (event) => {
    event.preventDefault()

    if (query === "") return

    const options = {}
    let searchUri = uri
    // The URI may have a /{className} suffix, which we translate into a filter for the search
    if (uri.startsWith(sinopiaSearchUri)) {
      const [baseUri, filter] = uri.split("/")
      if (filter) {
        options.typeFilter = `http://id.loc.gov/ontologies/bibframe/${filter}`
        searchUri = baseUri
      }
    }
    fetchNewSearchResults(query, searchUri, options)
    if (uri === "urn:ld4p:sinopia" && query !== "*") {
      fetchTemplateGuessSearchResults(query)
    } else {
      clearTemplateGuessSearchResults()
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      runSearch(event)
    }
  }

  return (
    <div className="flex-grow-1">
      <div className="input-group mb-2">
        <label htmlFor="search" className="col-form-label pe-1 ms-5">
          Search
        </label>
        <a
          href="#tooltip"
          className="tooltip-heading pt-2"
          tabIndex="0"
          data-bs-toggle="popover"
          data-bs-trigger="focus"
          ref={popoverRef}
        >
          <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
        </a>
        <select
          className="flex-grow-0 form-select"
          id="searchType"
          value={uri}
          onChange={handleUriChange}
          onBlur={handleUriChange}
        >
          <option value={sinopiaSearchUri}>Sinopia</option>
          <option value={`${sinopiaSearchUri}/Work`}>
            Sinopia BIBFRAME work resources
          </option>
          <option value={`${sinopiaSearchUri}/Instance`}>
            Sinopia BIBFRAME instance resources
          </option>
          <option value={`${sinopiaSearchUri}/Item`}>
            Sinopia BIBFRAME item resources
          </option>

          {options}
        </select>
        <input
          className="flex-grow-1 form-control"
          type="search"
          id="search"
          onChange={handleQueryChange}
          onBlur={handleQueryChange}
          onKeyPress={handleKeyPress}
          value={query}
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          aria-label="Submit search"
          data-testid="Submit search"
          onClick={runSearch}
        >
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </div>
  )
}

export default HeaderSearch
