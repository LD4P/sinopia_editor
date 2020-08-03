// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PanelResourceSubjectNavItem from './PanelResourceSubjectNavItem'

const PanelResourceNav = (props) => (
  <div className="col-sm-3">
    <div className="resource-nav-list-group">
      <div className="list-group">
        <PanelResourceSubjectNavItem level={0} subjectKey={props.resourceKey} />
      </div>
    </div>
  </div>
)

PanelResourceNav.propTypes = {
  resourceKey: PropTypes.string.isRequired,
}

export default PanelResourceNav
