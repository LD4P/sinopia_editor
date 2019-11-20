// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons'
import { groupName } from 'Utilities'

/**
 * Generates HTML rows of all search results
 */
const SearchResultRows = props => props.searchResults.map(row => (
  <tr key={row.uri}>
    <td>{ row.label }</td>
    <td>
      <ul className="list-unstyled">
        { row.type?.map(type => <li key={type}>{type}</li>) }
      </ul>
    </td>
    <td>{ groupName(row.uri) }</td>
    <td><relative-time datetime={ row.modified }>{ row.modified }</relative-time></td>
    <td>
      <div className="btn-group" role="group" aria-label="Result Actions">
        <button className="btn btn-link"
                title="Edit"
                onClick={e => props.handleEdit(row.uri, e) }>
          <FontAwesomeIcon icon={faEdit} size="2x" />
        </button>
        <button type="button"
                className="btn btn-link"
                onClick={() => props.handleCopy(row.uri)}
                title="Copy"
                aria-label="Copy this resource">
          <FontAwesomeIcon icon={faCopy} size="2x" />
        </button>
      </div>
    </td>
  </tr>
))

SearchResultRows.propTypes = {
  searchResults: PropTypes.array,
  handleEdit: PropTypes.func,
  handleCopy: PropTypes.func,
}

export default SearchResultRows
