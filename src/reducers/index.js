// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from "redux"
import { setUser, removeUser } from "./authenticate"
import { setLanguage, languagesReceived, setDefaultLang } from "./languages"
import { groupsReceived } from "./groups"
import {
  setBaseURL,
  hideProperty,
  showProperty,
  showNavProperty,
  hideNavProperty,
  showNavSubject,
  hideNavSubject,
  setUnusedRDF,
  setCurrentEditResource,
  setCurrentPreviewResource,
  setCurrentDiffResources,
  addSubject,
  addProperty,
  addValue,
  removeValue,
  removeSubject,
  clearResource,
  saveResourceFinished,
  loadResourceFinished,
  setResourceGroup,
  setValueOrder,
  clearResourceFromEditor,
  saveResourceFinishedEditor,
  updateValue,
  setVersions,
  clearVersions,
  setValuePropertyURI,
  setPropertyPropertyURI,
  setClasses,
} from "./resources"
import { setRelationships, clearRelationships } from "./relationships"
import {
  hideValidationErrors,
  addError,
  clearErrors,
  showValidationErrors,
} from "./errors"
import { showModal, hideModal, showLangModal } from "./modals"
import { showCopyNewMessage } from "./messages"
import { exportsReceived } from "./exports"
import { addTemplates } from "./templates"
import {
  addTemplateHistory,
  addTemplateHistoryByResult,
  addSearchHistory,
  addResourceHistory,
  addResourceHistoryByResult,
} from "./history"
import { clearSearchResults, setSearchResults } from "./search"
import { lookupOptionsRetrieved } from "./lookups"

export const setCurrentComponent = (state, action) => {
  const rootSubjectKey = action.payload.rootSubjectKey
  const componentKey = action.payload.key
  const rootPropertyKey = action.payload.rootPropertyKey

  // Don't change if modal open
  if (state.currentModal) return state

  const currentComponent = state.currentComponent[rootSubjectKey]
  if (
    currentComponent?.component === componentKey &&
    currentComponent?.property === rootPropertyKey
  )
    return state

  return {
    ...state,
    currentComponent: {
      ...state.currentComponent,
      [rootSubjectKey]: {
        component: componentKey,
        property: rootPropertyKey,
      },
    },
  }
}

const authHandlers = {
  SET_USER: setUser,
  REMOVE_USER: removeUser,
}

const editorHandlers = {
  ADD_ERROR: addError,
  CLEAR_ERRORS: clearErrors,
  CLEAR_RESOURCE: clearResourceFromEditor,
  HIDE_MODAL: hideModal,
  HIDE_VALIDATION_ERRORS: hideValidationErrors,
  SAVE_RESOURCE_FINISHED: saveResourceFinishedEditor,
  SET_CURRENT_COMPONENT: setCurrentComponent,
  SET_CURRENT_DIFF_RESOURCES: setCurrentDiffResources,
  SET_CURRENT_EDIT_RESOURCE: setCurrentEditResource,
  SET_CURRENT_PREVIEW_RESOURCE: setCurrentPreviewResource,
  SET_UNUSED_RDF: setUnusedRDF,
  SHOW_COPY_NEW_MESSAGE: showCopyNewMessage,
  SHOW_LANG_MODAL: showLangModal,
  SHOW_MODAL: showModal,
  SHOW_VALIDATION_ERRORS: showValidationErrors,
}

const entityHandlers = {
  ADD_PROPERTY: addProperty,
  ADD_SUBJECT: addSubject,
  ADD_TEMPLATES: addTemplates,
  ADD_VALUE: addValue,
  CLEAR_RELATIONSHIPS: clearRelationships,
  CLEAR_RESOURCE: clearResource,
  CLEAR_VERSIONS: clearVersions,
  EXPORTS_RECEIVED: exportsReceived,
  HIDE_NAV_PROPERTY: hideNavProperty,
  HIDE_NAV_SUBJECT: hideNavSubject,
  HIDE_PROPERTY: hideProperty,
  GROUPS_RECEIVED: groupsReceived,
  LANGUAGES_RECEIVED: languagesReceived,
  LANGUAGE_SELECTED: setLanguage,
  LOAD_RESOURCE_FINISHED: loadResourceFinished,
  LOOKUP_OPTIONS_RETRIEVED: lookupOptionsRetrieved,
  REMOVE_SUBJECT: removeSubject,
  REMOVE_VALUE: removeValue,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_CLASSES: setClasses,
  SET_DEFAULT_LANG: setDefaultLang,
  SET_VALUE_PROPERTY_URI: setValuePropertyURI,
  SET_PROPERTY_PROPERTY_URI: setPropertyPropertyURI,
  SET_RELATIONSHIPS: setRelationships,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_VALUE_ORDER: setValueOrder,
  SET_VERSIONS: setVersions,
  SHOW_NAV_PROPERTY: showNavProperty,
  SHOW_NAV_SUBJECT: showNavSubject,
  SHOW_PROPERTY: showProperty,
  UPDATE_VALUE: updateValue,
}

const historyHandlers = {
  ADD_RESOURCE_HISTORY: addResourceHistory,
  ADD_RESOURCE_HISTORY_BY_RESULT: addResourceHistoryByResult,
  ADD_SEARCH_HISTORY: addSearchHistory,
  ADD_TEMPLATE_HISTORY: addTemplateHistory,
  ADD_TEMPLATE_HISTORY_BY_RESULT: addTemplateHistoryByResult,
}

const searchHandlers = {
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  SET_SEARCH_RESULTS: setSearchResults,
}

export const createReducer =
  (handlers) =>
  (state = {}, action) => {
    const fn = handlers[action.type]
    return fn ? fn(state, action) : state
  }

const appReducer = combineReducers({
  authenticate: createReducer(authHandlers),
  editor: createReducer(editorHandlers),
  entities: createReducer(entityHandlers),
  history: createReducer(historyHandlers),
  search: createReducer(searchHandlers),
})

export default appReducer
