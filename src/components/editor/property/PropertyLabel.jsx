// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import PropTypes from 'prop-types'
import RequiredSuperscript from './RequiredSuperscript'

const PropertyLabel = (props) => {
  const key = shortid.generate()
  const property = props.propertyTemplate

  const title = [(
    <span key={key}>{property.propertyLabel}</span>
  )]

  if (property.mandatory === 'true') {
    title.push(<RequiredSuperscript key={shortid.generate()} />)
  }

  return title
}

PropertyLabel.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabel
