// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PropertyLabelInfoTooltip = (props) => {
  const key = shortid.generate()

  const popover = (
    <div id="popover-basic" title={props.propertyTemplate.label} >
      {props.propertyTemplate.remark}
    </div>
  )

  return (
    <div data-toggle="popover"
         data-placement="right"
         data-html="true"
         data-template={popover}
         key={key} >
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </div>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
