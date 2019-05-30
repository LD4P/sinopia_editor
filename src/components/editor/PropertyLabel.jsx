// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React, {Component} from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'
import PropTypes from 'prop-types'
import RequiredSuperscript from './RequiredSuperscript'

export class PropertyLabel extends Component {

  constructor(props) {
    super(props)
  }

  render () {

    const title = []
    const key = shortid.generate()
    const property = this.props.pt

    const popover = (
      <Popover id="popover-basic" title={property.label} >
        {property.remark}
      </Popover>
    )

    let url
    try {
      url = new URL(property.remark)
    } catch {
      //ignore
    }

    const urlLabel = (
      <a href={url} className="prop-remark" alt={property.remark} key={key} >
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

    url !== undefined ? title.push(urlLabel) : (property.remark !== undefined) ? title.push(toolTipLabel) : title.push(plainLabel)


    if (property.mandatory === "true"){
      title.push(<RequiredSuperscript key={shortid.generate()} />)
    }

    return title
  }

}

PropertyLabel.propTypes = {
  pt: PropTypes.object.isRequired
}
export default PropertyLabel
