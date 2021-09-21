// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"

const SearchRow = (props) => (
  <tr>
    <td style={{ wordBreak: "break-all" }} data-testid="authority">
      {props.row.authorityLabel}
    </td>
    <td style={{ wordBreak: "break-all" }}>{props.row.query}</td>
    <td>
      <div className="btn-group" role="group" aria-label="Actions">
        <button
          type="button"
          className="btn btn-link"
          title="Search"
          aria-label={`Search ${props.row.query} (${props.row.authorityLabel})`}
          data-testid={`Search ${props.row.query} (${props.row.authorityLabel})`}
          onClick={(e) =>
            props.handleSearch(props.row.query, props.row.authorityUri, e)
          }
        >
          <FontAwesomeIcon icon={faSearch} className="icon-lg" />
        </button>
      </div>
    </td>
  </tr>
)

SearchRow.propTypes = {
  row: PropTypes.object.isRequired,
  handleSearch: PropTypes.func.isRequired,
}

export default SearchRow
