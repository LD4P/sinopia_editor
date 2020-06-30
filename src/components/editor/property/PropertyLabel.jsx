// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import RequiredSuperscript from './RequiredSuperscript'

const PropertyLabel = (props) => {
  const title = [(
    <span key={props.propertyTemplate.key}>{props.propertyTemplate.label}</span>
  )]

  if (props.propertyTemplate.required) {
    title.push(<RequiredSuperscript key="required" />)
  }

  return title
}

PropertyLabel.propTypes = {
  propertyTemplate: PropTypes.object,
}

export default PropertyLabel
