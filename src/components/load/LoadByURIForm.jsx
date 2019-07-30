// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { retrieveResource } from 'actionCreators/resources'
import { getCurrentUser } from 'authSelectors'

const LoadByURIForm = (props) => {
  const [uri, setUri] = useState('')

  const handleURIChange = event => setUri(event.target.value)

  const handleSubmit = (event) => {
    if (uri !== '') {
      props.loadResource(props.currentUser, uri)
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
  loadResource: PropTypes.func,
  history: PropTypes.object,
  currentUser: PropTypes.object,
}

const mapDispatchToProps = (dispatch, ourProps) => ({
  loadResource: (user, uri) => {
    dispatch(retrieveResource(user, uri)).then(() => {
      ourProps.history.push('/editor')
    })
  },
})

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})


export default connect(mapStateToProps, mapDispatchToProps)(LoadByURIForm)
