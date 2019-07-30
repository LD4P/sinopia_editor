// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabelInfoLink from './PropertyLabelInfoLink'
import PropertyLabelInfoTooltip from './PropertyLabelInfoTooltip'

import _ from 'lodash'

const PropertyLabelInfo = (props) => {
  let url

  try {
    url = new URL(props.propertyTemplate.remark)
  } catch {
    // Ignore
  }

  if (url !== undefined) {
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
