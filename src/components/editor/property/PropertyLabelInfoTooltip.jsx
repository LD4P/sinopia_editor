// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef } from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons"
import { Popover } from "bootstrap"

const PropertyLabelInfoTooltip = (props) => {
  const popoverRef = useRef()

  useEffect(() => {
    const popover = new Popover(popoverRef.current)

    return () => popover.hide
  }, [popoverRef])

  return (
    <a
      href="#tooltip"
      className="tooltip-heading"
      tabIndex="0"
      data-bs-toggle="popover"
      data-bs-trigger="focus"
      data-bs-placement="right"
      data-bs-container="body"
      data-testid={props.propertyTemplate.label}
      title={props.propertyTemplate.label}
      data-bs-content={props.propertyTemplate.remark}
      ref={popoverRef}
    >
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </a>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
