// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import LongDate from 'components/LongDate'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faEdit } from '@fortawesome/free-solid-svg-icons'


/**
 * This is the list view of all the templates
 */
const ResourceTemplateRow = (props) => (<tr key={props.row.id}>
  <td style={{ wordBreak: 'break-all' }} data-testid="name">
    <Link to={{ pathname: '/editor', state: { } }} onClick={(e) => props.handleClick(props.row.id, e)}>{props.row.resourceLabel}</Link><br />
    { props.row.id }
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.resourceURI }
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.author }
  </td>
  <td>
    <LongDate datetime={ props.row.date} timeZone="UTC"/>
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.remark }
  </td>
  <td>
    <div className="btn-group" role="group" aria-label="Result Actions">
      <button type="button"
              className="btn btn-link"
              title="Edit"
              aria-label={`Edit ${props.row.label}`}
              onClick={(e) => props.handleEdit(props.row.uri, e) }>
        <FontAwesomeIcon icon={faEdit} className="icon-lg" />
      </button>
      <button type="button"
              className="btn btn-link"
              onClick={() => props.handleCopy(props.row.uri)}
              title="Copy"
              aria-label={`Copy ${props.row.label}`}>
        <FontAwesomeIcon icon={faCopy} className="icon-lg" />
      </button>
    </div>
  </td>
</tr>)

ResourceTemplateRow.propTypes = {
  row: PropTypes.object,
  handleClick: PropTypes.func.isRequired,
  handleCopy: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
}

export default ResourceTemplateRow
