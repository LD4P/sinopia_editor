// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'

export class RequiredSuperscript extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <abbr title="This field is required">
        <sup>
          <FontAwesomeIcon className="asterick text-danger"
                           icon={faAsterisk} />
        </sup>
      </abbr>
    )
  }
}

export default RequiredSuperscript
