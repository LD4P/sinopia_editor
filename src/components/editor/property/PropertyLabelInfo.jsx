// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabelInfoLink from './PropertyLabelInfoLink'
import PropertyLabelInfoTooltip from './PropertyLabelInfoTooltip'

import _ from 'lodash'

const PropertyLabelInfo = (props) => {
  if (props.propertyTemplate.remarkUrl !== null) {
    return (<PropertyLabelInfoLink {...props} />)
  } if (!_.isEmpty(props.propertyTemplate.remark)) {
    return (<PropertyLabelInfoTooltip {...props} />)
  }
  return null
}

PropertyLabelInfo.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfo
