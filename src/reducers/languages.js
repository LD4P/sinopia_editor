// Copyright 2020 Stanford University see LICENSE for license
import { setSubjectChanged } from "reducers/resources"

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
