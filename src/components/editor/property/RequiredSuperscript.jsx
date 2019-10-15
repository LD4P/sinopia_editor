// Copyright 2019 Stanford University see LICENSE for license

import shortid from 'shortid'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'

const RequiredSuperscript = () => (
  <sup aria-label="required" placement="right"
       trigger={['hover', 'focus']}
       key={shortid.generate()}
       title="please fill out this field">
    <FontAwesomeIcon className="asterick-icon" icon={faAsterisk} />
  </sup>
)

export default RequiredSuperscript
