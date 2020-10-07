// Copyright 2018 Stanford University see LICENSE for license

/**
 * Adds a lookup to state.
 * @param {Object} state the previous redux state
 * @param {Object} action to be performed
 * @return {Object} the next redux state
 */
export const lookupOptionsRetrieved = (state, action) => {
  const lookups = [...action.payload.lookup]
  lookups.sort((item1, item2) => {
    if (item1.label < item2.label) {
      return -1
    }
    if (item1.label > item2.label) {
      return 1
    }
    return 0
  })
  return {
    ...state,
    lookups: {
      ...state.lookups,
      [action.payload.uri]: lookups,
    },
  }
}

export const noop = () => {}
