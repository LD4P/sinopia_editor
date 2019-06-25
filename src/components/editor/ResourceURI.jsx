// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Renders the resource URI after Save & Publish
const ResourceURI = (props) => {
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h4>URI for this resource: { props.uri }</h4>
    </div>
  )
}

ResourceURI.propTypes = {
  show: PropTypes.bool,
  uri: PropTypes.string
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.resourceURI.show,
  uri: state.selectorReducer.editor.resourceURI.uri,
})

export default connect(mapStateToProps, null)(ResourceURI)

