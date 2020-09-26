// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PropertyLabelInfoTooltip = (props) => {
  const [key] = useState(`popover-${shortid.generate()}`)

  useEffect(() => {
    window.$(`#${key}`).popover()
  }, [key])

  return (
    <a href="#"
       className="tooltip-heading"
       tabIndex="0"
       data-toggle="popover"
       data-trigger="focus"
       data-placement="right"
       data-container="body"
       data-testid={props.propertyTemplate.label}
       title={props.propertyTemplate.label}
       data-content={props.propertyTemplate.remark}
       key={key}
       id={key}>
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </a>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
