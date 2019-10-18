// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import Download from 'components/templates/Download'

/**
 * This is the list view of all the templates
 */
const ResourceTemplateRow = props => (<tr key={props.row.id}>
  <td style={{ wordBreak: 'break-all' }} data-testid="name">
    <Link to={{ pathname: '/editor', state: { } }} onClick={e => props.navigate(props.row.id, e)}>{props.row.name}</Link>
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.id }
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.author }
  </td>
  <td style={{ wordBreak: 'break-all' }}>
    { props.row.remark }
  </td>
  <td>
    <Download resourceTemplateId={ props.row.id } groupName={ props.row.group } />
  </td>
</tr>)

ResourceTemplateRow.propTypes = {
  row: PropTypes.object,
  navigate: PropTypes.func,
}

export default ResourceTemplateRow
