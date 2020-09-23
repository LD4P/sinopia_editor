// Copyright 2019 Stanford University see LICENSE for license

/**
 * Return lookup based on URI.
 * @param [Object] state
 * @param [string] URI of the lookup
 * @return [Object] the lookup if found
 */
export const selectLookup = (state, uri) => state.entities.lookups[uri]

export const noop = () => {}
