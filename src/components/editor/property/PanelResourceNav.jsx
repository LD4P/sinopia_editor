// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PanelPropertyNav from './PanelPropertyNav'
import ActivePanelPropertyNav from './ActivePanelPropertyNav'
import { selectCurrentPropertyKey } from 'selectors/index'
import { useSelector } from 'react-redux'

const PanelResourceNav = (props) => {
  const currentPropertyKey = useSelector((state) => selectCurrentPropertyKey(state, props.resource.key))

  const navItems = props.resource.properties.map((property) => {
    if (property.key === currentPropertyKey) {
      return (<ActivePanelPropertyNav key={property.key} propertyKey={property.key} />)
    }
    return (<PanelPropertyNav key={property.key} propertyKey={property.key} />)
  })
  return (
    <div className="col-sm-3">
      <div className="resource-nav-list-group">
        <ul>
          { navItems }
        </ul>
      </div>
    </div>
  )
}

PanelResourceNav.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResourceNav
