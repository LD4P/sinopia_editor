// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabel from './PropertyLabel'

const PropertyPanel = (props) => {
  const floatClass = props.float > 0 && props.float % 0 > 0 ? 'pull-right' : 'pull-left'
  const cssClasses = `panel panel-property ${floatClass}`

  return (
    <div className={ cssClasses } data-label={ props.propertyTemplate.propertyLabel }>
      <div className="panel-heading prop-heading">
        <PropertyLabel propertyTemplate={ props.propertyTemplate } />
      </div>
      <div className="panel-body">
        { props.children }
      </div>
    </div>
  )
}

PropertyPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  float: PropTypes.number,
  propertyTemplate: PropTypes.object.isRequired,
}

export default PropertyPanel
