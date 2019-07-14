// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Renders the resource URI message after Save & Publish
const ResourceURIMessage = (props) => {
  if (!props.show || !props.uri) {
    return null
  }

  return (
    <div>
      <h4>URI for this resource: &lt;{ props.uri }&gt;</h4>
    </div>
  )
}

ResourceURIMessage.propTypes = {
  show: PropTypes.bool,
  uri: PropTypes.string,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.resourceURIMessage.show,
  uri: state.selectorReducer.editor.resourceURIMessage.uri,
})

export default connect(mapStateToProps, null)(ResourceURIMessage)
