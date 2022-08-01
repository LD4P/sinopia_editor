// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React from "react"
import { useSelector } from "react-redux"
import { selectSearchResults } from "selectors/search"
import TypeFilter from "./TypeFilter"
import GroupFilter from "./GroupFilter"
import SearchResultRows from "./SearchResultRows"
import SinopiaSort from "./SinopiaSort"
import MarcModal from "../editor/actions/MarcModal"
import _ from "lodash"

const SinopiaSearchResults = () => {
  const searchResults = useSelector((state) =>
    selectSearchResults(state, "resource")
  )

  if (_.isEmpty(searchResults)) {
    return null
  }

  return (
    <React.Fragment>
      <MarcModal />
      <div className="row">
        <div className="col" style={{ marginBottom: "5px" }}>
          <TypeFilter />
          <GroupFilter />
        </div>
      </div>
      <div
        id="search-results"
        className="row"
        data-testid="sinopia-search-results"
      >
        <div className="col">
          <table
            className="table table-bordered search-results-list"
            id="search-results-list"
            data-testid="sinopia-search-results-list"
          >
            <thead>
              <tr>
                <th>Label / ID</th>
                <th style={{ width: "30%" }}>Class</th>
                <th style={{ width: "15%" }}>Group</th>
                <th style={{ width: "10%" }}>Modified</th>
                <th style={{ width: "10%" }}>
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
