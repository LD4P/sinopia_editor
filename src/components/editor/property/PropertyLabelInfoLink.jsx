// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

const PropertyLabelInfoLink = (props) => {
  const key = shortid.generate()
  const url = new URL(props.propertyTemplate.remark)

  return (
    <a href={url} className="prop-remark" alt={props.propertyTemplate.remark} key={key}
       target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon className="info-icon" icon={faExternalLinkAlt} />
    </a>
  )
}

PropertyLabelInfoLink.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabelInfoLink
