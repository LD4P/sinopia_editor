// Copyright 2019 Stanford University see LICENSE for license

/**
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is a boolean that says to show or not to show the CopyNewMessage
 * @return {Object} the next redux state
 */
export const showCopyNewMessage = (state, action) => {
  const newState = { ...state }

  const oldUri = action.payload
  newState.editor.copyToNewMessage.timestamp = Date.now()
  if (oldUri !== undefined) {
    newState.editor.copyToNewMessage.oldUri = oldUri
  }
  return newState
}

export const noop = () => {}
