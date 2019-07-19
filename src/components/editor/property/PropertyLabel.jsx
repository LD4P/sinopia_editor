// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types'
import RequiredSuperscript from './RequiredSuperscript'

import _ from 'lodash'

const PropertyLabel = (props) => {
  const key = shortid.generate()
  const property = props.propertyTemplate

  const popover = (
    <Popover id="popover-basic" title={property.label} >
      {property.remark}
    </Popover>
  )

  let url

  try {
    url = new URL(property.remark)
  } catch {
    // Ignore
  }

  const urlLabel = (
    <a href={url} className="prop-remark" alt={property.remark} key={key}
       target="_blank" rel="noopener noreferrer">
      <span className="prop-remark">{property.propertyLabel}</span>
    </a>
  )

  const toolTipLabel = (
    <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover} key={key} >
      <span className="prop-remark" >{property.propertyLabel}</span>
    </OverlayTrigger>
  )

  const plainLabel = (
    <span key={key}>{property.propertyLabel}</span>
  )

  const title = url !== undefined ? [urlLabel] : !_.isEmpty(property.remark) ? [toolTipLabel] : [plainLabel]

  if (property.mandatory === 'true') {
    title.push(<RequiredSuperscript key={shortid.generate()} />)
  }

  return title
}

PropertyLabel.propTypes = {
  propertyTemplate: PropTypes.object.isRequired,
}
export default PropertyLabel
