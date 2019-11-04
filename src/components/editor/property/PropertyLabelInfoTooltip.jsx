// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'

const PropertyLabelInfoTooltip = (props) => {
  const key = shortid.generate()

  useEffect(() => {
    window.$('[data-toggle="popover"]').popover()
    window.$('.popover-dismiss').popover({ trigger: 'focus' })
  })

  return (
    <a data-toggle="popover"
       data-trigger="focus"
       data-placement="right"
       data-container="body"
       tabIndex="0"
       className="prop-remark"
       title={props.propertyTemplate.label}
       data-content={props.propertyTemplate.remark}
       href="#"
       key={key} >
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </a>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
