// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import { flashMessages } from 'selectors/flashSelectors'

/**
 * An info message that is populated when retrieving a resource template
 */
const CreateResourceMessages = () => {
  const messages = useSelector(state => flashMessages(state))

  if (messages.length === 0) return null

  const messageItems = messages.map(message => <li key={message}>{message}</li>)

  return (
    <div className="alert alert-info">
      <ul className="list-unstyled" style={{ marginBottom: 0 }}>
        { messageItems }
      </ul>
    </div>
  )
}

export default CreateResourceMessages
