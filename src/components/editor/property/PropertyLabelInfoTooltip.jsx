// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PropertyLabelInfoTooltip = (props) => {
  const key = shortid.generate()

  const popover = (
    <Popover id="popover-basic" title={props.propertyTemplate.label} >
      {props.propertyTemplate.remark}
    </Popover>
  )

  return (
    <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover} key={key} >
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </OverlayTrigger>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
