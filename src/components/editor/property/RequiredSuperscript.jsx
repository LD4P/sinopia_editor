// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const RequiredSuperscript = () => {
  const popover = (
    <Popover id="popover-basic" role="tooltip" >
      please fill out this field
    </Popover>
  )

  return (
    <OverlayTrigger trigger={['hover', 'focus']} placement="right" overlay={popover} key={shortid.generate()} >
      <sup aria-label="required" >
        <FontAwesomeIcon className="asterick-icon" icon={faAsterisk} />
      </sup>
    </OverlayTrigger>
  )
}

export default RequiredSuperscript
