// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useRef } from "react"
import { useSelector } from "react-redux"
import { selectSearchResults } from "selectors/search"
import Alerts from "../Alerts"
import TypeFilter from "./TypeFilter"
import GroupFilter from "./GroupFilter"
import SearchResultRows from "./SearchResultRows"
import SinopiaSort from "./SinopiaSort"
import ViewResourceModal from "../ViewResourceModal"
import useResource from "hooks/useResource"

// Errors from retrieving a resource from this page.
export const searchRetrieveErrorKey = "searchresource"

const SinopiaSearchResults = () => {
  const errorsRef = useRef(null)

  const { handleCopy, handleEdit, handleView } = useResource(
    searchRetrieveErrorKey,
    errorsRef
  )

  const searchResults = useSelector((state) =>
    selectSearchResults(state, "resource")
  )

  if (searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <ViewResourceModal handleEdit={handleEdit} handleCopy={handleCopy} />
      <div ref={errorsRef}>
        <Alerts errorKey={searchRetrieveErrorKey} />
      </div>
      <div className="row">
        <div className="col" style={{ marginBottom: "5px" }}>
          <TypeFilter />
          <GroupFilter />
        </div>
      </div>
      <div id="search-results" className="row">
        <div className="col">
          <table
            className="table table-bordered search-results-list"
            id="search-results-list"
          >
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Label / ID</th>
                <th style={{ width: "35%" }}>Class</th>
                <th style={{ width: "20%" }}>Group</th>
                <th style={{ width: "10%" }}>Modified</th>
                <th>
                  <SinopiaSort />
                </th>
              </tr>
            </thead>
            <tbody>
              <SearchResultRows
                searchResults={searchResults}
                handleEdit={handleEdit}
                handleCopy={handleCopy}
                handleView={handleView}
              />
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SinopiaSearchResults
