export const rootResource = state => Object.values(state.selectorReducer.resource)[0]

export const rootResourceId = state => rootResource(state)?.resourceURI
