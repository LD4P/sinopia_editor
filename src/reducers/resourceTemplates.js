// Copyright 2019 Stanford University see LICENSE for license

import _ from 'lodash'

// Keeps a unique list of templates limited to 7
export const addTemplateHistory = (state, action) => {
  const newState = { ...state }
  newState.historicalTemplates.results = _.uniqBy([...state.historicalTemplates.results, action.payload],
    item => item.id).slice(-7)
  newState.historicalTemplates.totalResults = newState.historicalTemplates.results.length
  return newState
}

// To avoid have to export addTemplateHistory as default
export const noop = () => {}
