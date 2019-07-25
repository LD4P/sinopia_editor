
// Copyright 2019 Stanford University see LICENSE for license

import { loadingLanguages, languagesReceived } from 'actions/entities'

const loadLanguages = () => (dispatch, getState) => {
  if (getState().selectorReducer.entities.languages.options.length > 0) {
    return // Languages already loaded
  }

  dispatch(loadingLanguages())
  fetch('https://id.loc.gov/vocabulary/iso639-1.json')
    .then(resp => resp.json())
    .then((json) => {
      dispatch(languagesReceived(json))
    })
    .catch(() => false)
}

export default loadLanguages
