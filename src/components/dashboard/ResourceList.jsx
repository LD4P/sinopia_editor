// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React from "react"
import PropTypes from "prop-types"
import SearchResultRows from "../search/SearchResultRows"

const ResourceList = (props) => {
  if (props.resources.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <div className="row">
        <div className="col">
          <table
            className="table table-bordered resource-list"
            id="resource-list"
          >
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Label / ID</th>
                <th style={{ width: "35%" }}>Class</th>
                <th style={{ width: "20%" }}>Group</th>
                <th style={{ width: "10%" }}>Modified</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <SearchResultRows searchResults={props.resources} />
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  )
}

ResourceList.propTypes = {
  resources: PropTypes.array.isRequired,
}

export default ResourceList
