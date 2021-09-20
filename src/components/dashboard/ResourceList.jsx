// Copyright 2019 Stanford University see LICENSE for license
/* eslint max-params: ["error", 4] */

import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import SearchResultRows from '../search/SearchResultRows'
import ViewResourceModal from '../ViewResourceModal'
import useResource from 'hooks/useResource'
import { dashboardErrorKey } from './Dashboard'
import { selectAllGroups } from 'selectors/groups'
import { groupListToMap } from 'utilities/Utilities'

const ResourceList = (props) => {
  const { handleCopy, handleEdit, handleView } = useResource(dashboardErrorKey)
  const groupList = useSelector((state) => selectAllGroups(state))
  const groupMap = useMemo(() => groupListToMap(groupList), [groupList])

  if (props.resources.length === 0) {
    return null
  }

  return (
    <React.Fragment>
      <ViewResourceModal handleEdit={handleEdit} handleCopy={handleCopy} />
      <div className="row">
        <div className="col">
          <table className="table table-bordered resource-list" id="resource-list">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>
                  Label / ID
                </th>
                <th style={{ width: '35%' }}>
                  Class
                </th>
                <th style={{ width: '20%' }}>
                  Group
                </th>
                <th style={{ width: '10%' }}>
                  Modified
                </th>
                <th>
                </th>
              </tr>
            </thead>
            <tbody>
              <SearchResultRows searchResults={props.resources}
                                handleEdit={handleEdit}
                                handleCopy={handleCopy}
                                handleView={handleView}
                                groupMap={groupMap} />
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
