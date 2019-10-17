// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import LoadByRDFForm from './LoadByRDFForm'

const LoadResource = props => (
  <div id="loadResource">
    <Header triggerEditorMenu={props.triggerHandleOffsetMenu}/>
    <LoadByRDFForm {...props} />
  </div>
)

LoadResource.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  history: PropTypes.object,
}

export default LoadResource
