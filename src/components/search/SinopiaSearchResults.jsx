// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React from "react"
import { useSelector } from "react-redux"
import { selectSearchResults } from "selectors/search"
import TypeFilter from "./TypeFilter"
import GroupFilter from "./GroupFilter"
import SearchResultRows from "./SearchResultRows"
import SinopiaSort from "./SinopiaSort"
import PreviewModal from "../editor/preview/PreviewModal"
import { searchErrorKey } from "./Search"

const SinopiaSearchResults = () => {
  const searchResults = useSelector((state) =>
    selectSearchResults(state, "resource")
  )

  if (searchResults.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <PreviewModal errorKey={searchErrorKey} />
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
              <SearchResultRows searchResults={searchResults} />
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SinopiaSearchResults
