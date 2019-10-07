// Copyright 2019 Stanford University see LICENSE for license

export const loadingLanguages = () => ({
  type: 'LOADING_LANGUAGES',
})

export const languagesReceived = json => ({
  type: 'LANGUAGES_RECEIVED',
  payload: json,
})

export const lookupOptionsRetrieved = (uri, lookup) => ({
  type: 'LOOKUP_OPTIONS_RETRIEVED',
  payload: {
    uri,
    lookup,
  },
})
