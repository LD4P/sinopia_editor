// Copyright 2018 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

// Renders the base URL after Save & Publish
const BaseURL = (props) => {
  if (!props.show) {
    return null
  }

  return (
    <div>
      <h4>URI for this resource: &lt;{ props.url }&gt;</h4>
    </div>
  )
}

BaseURL.propTypes = {
  show: PropTypes.bool,
  url: PropTypes.string,
}

const mapStateToProps = state => ({
  show: state.selectorReducer.editor.baseURL.show,
  url: state.selectorReducer.editor.baseURL.url,
})

export default connect(mapStateToProps, null)(BaseURL)
