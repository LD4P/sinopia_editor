// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAsterisk } from '@fortawesome/free-solid-svg-icons'

export class RequiredSuperscript extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (<sup>
              <FontAwesomeIcon className="asterick text-danger"
                               icon={faAsterisk} />
           </sup>)
  }
}

export default RequiredSuperscript;
