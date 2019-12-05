// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { getCurrentSession } from 'authSelectors'

const AuthenticationMessage = (props) => {
  if (props.currentSession) {
    return null
  }

  return (
    <div className="alert alert-warning alert-dismissible">
      <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
      Alert! No data can be saved unless you are logged in with group permissions.
    </div>
  )
}

AuthenticationMessage.propTypes = {
  currentSession: PropTypes.object,
}

const mapStateToProps = (state) => ({
  currentSession: getCurrentSession(state),
})

export default connect(mapStateToProps, {})(AuthenticationMessage)
