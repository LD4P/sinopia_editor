// Copyright 2019 Stanford University see LICENSE for license

export const selectExports = (state) => state.selectorReducer.entities.exports

export const hasExports = (state) => state.selectorReducer.entities.exports.length > 0
