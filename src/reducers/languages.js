// Copyright 2020 Stanford University see LICENSE for license
import { setSubjectChanged } from "reducers/resources"
import {
  mergeSubjectPropsToNewState,
  recursiveDescFromSubject,
} from "./resourceHelpers"
import _ from "lodash"

export const setLanguage = (state, action) => {
  const valueKey = action.payload.valueKey
  const value = state.values[valueKey]
  const property = state.properties[value.propertyKey]
  const newState = setSubjectChanged(state, property.subjectKey, true)
  return {
    ...newState,
    values: {
      ...newState.values,
      [valueKey]: {
        ...newState.values[valueKey],
        lang: action.payload.lang,
      },
    },
  }
}

export const languagesReceived = (state, action) => ({
  ...state,
  ...action.payload,
})

export const setDefaultLang = (state, action) => {
  const { resourceKey, lang } = action.payload
  const newState = mergeSubjectPropsToNewState(state, resourceKey, {
    defaultLang: lang,
  })

  const updateLang = (value) => {
    if (value.component === "InputLiteralValue" && _.isEmpty(value.literal)) {
      value.lang = lang
    }
    if (value.component === "InputURIValue" && _.isEmpty(value.label)) {
      value.lang = lang
    }
  }

  return recursiveDescFromSubject(newState, resourceKey, updateLang)
}
