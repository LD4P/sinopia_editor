// Copyright 2019 Stanford University see Apache2.txt for license

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

    let title = []
    const key = shortid.generate()
    const property = this.props.pt

    const popover = (
      <Popover id="popover-basic" title={property.label} >
        {property.remark}
      </Popover>
    )

    try {
      const url = new URL(property.remark)
      title.push(
        <a href={url} className="prop-remark" alt={property.remark} key={key} >
          <span className="prop-remark">{property.propertyLabel}</span>
        </a>
      )
    } catch (_) {
      if (property.remark) {
        title.push(
          <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover} key={key} >
            <span className="prop-remark" >{property.propertyLabel}</span>
          </OverlayTrigger>
        )
      } else {
        title.push(<span key={key}>{property.propertyLabel}</span>)
      }
    }

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
