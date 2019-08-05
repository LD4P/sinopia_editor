// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { rootResourceId } from 'selectors/resourceSelectors'

// Renders the resource URI message after Save & Publish
const ResourceURIMessage = (props) => {
  if (!props.uri) {
    return null
  }

  return (
    <div>
      <h4>URI for this resource: &lt;{ props.uri }&gt;</h4>
    </div>
  )
}

ResourceURIMessage.propTypes = {
  uri: PropTypes.string,
}

const mapStateToProps = state => ({
  uri: rootResourceId(state),
})

export default connect(mapStateToProps, null)(ResourceURIMessage)
