// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'

/**
 * An info message that is populated when retrieving a resource template
 */
const CreateResourceMessages = (props) => {
  if (props.messages.length === 0) return null

  const messageItems = props.messages.map(message => <li key={message}>{message}</li>)

  return (
    <div className="alert alert-info">
      <ul className="list-unstyled" style={{ marginBottom: 0 }}>
        { messageItems }
      </ul>
    </div>
  )
}

CreateResourceMessages.propTypes = {
  messages: PropTypes.array,
}

export default CreateResourceMessages
