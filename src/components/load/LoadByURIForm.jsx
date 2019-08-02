// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { retrieveResource } from 'actionCreators/resources'
import { getCurrentUser } from 'authSelectors'
import { rootResource } from 'selectors/resourceSelectors'

const LoadByURIForm = (props) => {
  const [uri, setUri] = useState('')
  const [navigateEditor, setNavigateEditor] = useState(false)

  const handleURIChange = event => setUri(event.target.value)

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && props.rootResource) {
      props.history.push('/editor')
    }
  })

  const handleSubmit = (event) => {
    if (uri !== '') {
      props.retrieveResource(props.currentUser, uri)
      setNavigateEditor(true)
    }
    event.preventDefault()
  }

  return (
    <div>
      <h4>Load by URI</h4>
      <form id="loadURIForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="uriInput">URI</label>
          <input type="text" className="form-control" id="loadUriInput" value={uri} onChange={handleURIChange} />
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  )
}


LoadByURIForm.propTypes = {
  retrieveResource: PropTypes.func,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  rootResource: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
  rootResource: rootResource(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({ retrieveResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LoadByURIForm)
