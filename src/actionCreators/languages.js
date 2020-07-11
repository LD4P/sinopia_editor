// Copyright 2019 Stanford University see LICENSE for license

import { fetchingLanguages, languagesReceived } from 'actions/languages'

export const fetchLanguages = () => (dispatch, getState) => {
  if (getState().selectorReducer.entities.languages.options.length > 0) {
    return // Languages already loaded
  }

  dispatch(fetchingLanguages())
  return fetch('https://id.loc.gov/vocabulary/iso639-2.json')
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(languagesReceived(json))
    })
    .catch(() => false)
}

export const noop = () => {}
