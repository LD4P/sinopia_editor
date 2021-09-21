// Copyright 2019 Stanford University see LICENSE for license

import { languagesReceived } from "actions/languages"
import { hasLanguages } from "selectors/languages"

export const fetchLanguages = () => (dispatch, getState) => {
  if (hasLanguages(getState())) {
    return // Languages already loaded
  }

  return fetch("https://id.loc.gov/vocabulary/iso639-2.json")
    .then((resp) => resp.json())
    .then((json) => {
      dispatch(languagesReceived(json))
    })
    .catch(() => false)
}

export const noop = () => {}
