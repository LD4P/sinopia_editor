// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Popover } from 'react-bootstrap'

export class RequiredSuperscript extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const popover = (
      <Popover id="popover-basic" role="tooltip" >
        please fill out this field
      </Popover>
    )

    const required = (
      <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover} key={shortid.generate()} >
        <sup tabIndex="0" >
          <FontAwesomeIcon className="asterick text-danger" icon={faAsterisk} />
        </sup>
      </OverlayTrigger>
    )

    return required
  }
}

export default RequiredSuperscript
