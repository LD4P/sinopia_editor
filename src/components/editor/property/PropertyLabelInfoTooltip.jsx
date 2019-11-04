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
    window.$('a.nav-link').on('click',function(e) {window.$('.popover').popover('hide')})
  })

  return (
    <span data-toggle="popover"
          data-placement="right"
          data-container="body"
          title={props.propertyTemplate.label}
          data-content={props.propertyTemplate.remark}
          key={key} >
      <FontAwesomeIcon className="info-icon" icon={faInfoCircle} />
    </span>
  )
}

PropertyLabelInfoTooltip.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoTooltip
