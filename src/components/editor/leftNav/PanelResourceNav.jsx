// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import PanelPropertyNav from './PanelPropertyNav'
import ActivePanelPropertyNav from './ActivePanelPropertyNav'
import { selectCurrentPropertyKey } from 'selectors/index'

const PanelResourceNav = (props) => {
  const currentPropertyKey = useSelector((state) => selectCurrentPropertyKey(state, props.resource?.key))
  const isTemplate = props.resource.subjectTemplateKey === 'sinopia:template:resource'
  const classNames = ['resource-nav-list-group']
  if (isTemplate) {
    classNames.push('template')
  }

  const navItems = props.resource.propertyKeys.map((propertyKey) => {
    if (propertyKey === currentPropertyKey) {
      return (<ActivePanelPropertyNav key={propertyKey} propertyKey={propertyKey} />)
    }
    return (<PanelPropertyNav key={propertyKey} propertyKey={propertyKey} />)
  })
  return (
    <div className="col-sm-3 left-nav">
      <div className={classNames.join(' ')}>
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
