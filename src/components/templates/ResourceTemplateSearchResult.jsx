// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import ResourceTemplateRow from './ResourceTemplateRow'

/**
 * This is the list view of all the templates
 */
const ResourceTemplateSearchResult = (props) => {
  const resourceTemplateSummaries = props.search.results
  const rows = resourceTemplateSummaries.map(row => <ResourceTemplateRow row={row} key={row.id} navigate={props.handleClick}/>)

  return (
    <div className="row">
      <div className="col">
        <table className="table table-bordered resource-template-list">
          <thead>
            <tr>
              <th style={{ backgroundColor: '#F8F6EF', width: '30%' }}>
              Label / ID
              </th>
              <th style={{ backgroundColor: '#F8F6EF', width: '20%' }}>
              Resource URI
              </th>
              <th style={{ backgroundColor: '#F8F6EF', width: '12%' }}>
              Author
              </th>
              <th style={{ backgroundColor: '#F8F6EF', width: '10%' }}>
              Date
              </th>
              <th style={{ backgroundColor: '#F8F6EF', width: '24%' }}>
              Guiding statement
              </th>
              <th style={{ backgroundColor: '#F8F6EF', width: '4%' }}
                  data-testid="download-col-header">
                Download
              </th>
            </tr>
          </thead>
          <tbody>
            { rows }
          </tbody>
        </table>
      </div>
    </div>
  )
}

ResourceTemplateSearchResult.propTypes = {
  handleClick: PropTypes.func,
  search: PropTypes.object,
}

export default ResourceTemplateSearchResult
