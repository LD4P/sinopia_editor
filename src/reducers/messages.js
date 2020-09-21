// Copyright 2019 Stanford University see LICENSE for license

/**
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is a boolean that says to show or not to show the CopyNewMessage
 * @return {Object} the next redux state
 */
export const showCopyNewMessage = (state, action) => ({
  ...state,
  copyToNewMessage: {
    timestamp: action.payload.timestamp,
    oldUri: action.payload.oldUri,
  },
})

export const noop = () => {}
