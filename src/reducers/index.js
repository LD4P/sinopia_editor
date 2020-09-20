// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import {
  setUser, removeUser,
} from './authenticate'
import {
  setLiteralInputContent, hideDiacriticsSelection, showDiacriticsSelection,
  setCursorPosition,
} from './inputs'
import {
  setBaseURL, hideProperty, showProperty,
  setUnusedRDF, setCurrentResource,
  addSubject, addProperty, addValue, removeValue,
  removeSubject, clearResource,
  saveResourceFinished, loadResourceFinished,
  setResourceGroup, setValueOrder,
} from './resources'
import {
  setLanguage, fetchingLanguages, languagesReceived,
} from './languages'
import {
  hideValidationErrors, addError, clearErrors,
  showValidationErrors,
} from './errors'
import {
  showGroupChooser,
  showModal, hideModal, addModalMessage, clearModalMessages,
} from './modals'
import { showCopyNewMessage } from './messages'
import {
  exportsReceived,
} from './exports'
import {
  addTemplates, addTemplateHistory,
} from './templates'
import {
  clearSearchResults, setSearchResults, clearTemplateSearchResults, setTemplateSearchResults,
} from './search'
import {
  lookupOptionsRetrieved,
} from './lookups'

export const setAppVersion = (state, action) => {
  const newState = { ...state }

  newState.appVersion.version = action.payload
  return newState
}

export const setCurrentComponent = (state, action) => {
  const newState = { ...state }

  newState.editor.currentComponent[action.payload.resourceKey] = action.payload.key

  return newState
}

const handlers = {
  ADD_MODAL_MESSAGE: addModalMessage,
  ADD_TEMPLATE_HISTORY: addTemplateHistory,
  ADD_ERROR: addError,
  CLEAR_ERRORS: clearErrors,
  CLEAR_MODAL_MESSAGES: clearModalMessages,
  CLEAR_RESOURCE: clearResource,
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  CLEAR_TEMPLATE_SEARCH_RESULTS: clearTemplateSearchResults,
  EXPORTS_RECEIVED: exportsReceived,
  FETCHING_LANGUAGES: fetchingLanguages,
  HIDE_DIACRITICS: hideDiacriticsSelection,
  HIDE_PROPERTY: hideProperty,
  HIDE_MODAL: hideModal,
  HIDE_VALIDATION_ERRORS: hideValidationErrors,
  LANGUAGE_SELECTED: setLanguage,
  LANGUAGES_RECEIVED: languagesReceived,
  LOAD_RESOURCE_FINISHED: loadResourceFinished,
  LOOKUP_OPTIONS_RETRIEVED: lookupOptionsRetrieved,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_APP_VERSION: setAppVersion,
  SET_BASE_URL: setBaseURL,
  SET_LITERAL_CONTENT: setLiteralInputContent,
  SET_CURRENT_COMPONENT: setCurrentComponent,
  SET_CURRENT_RESOURCE: setCurrentResource,
  SET_CURSOR_POSITION: setCursorPosition,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_SEARCH_RESULTS: setSearchResults,
  SET_TEMPLATE_SEARCH_RESULTS: setTemplateSearchResults,
  SET_UNUSED_RDF: setUnusedRDF,
  SET_VALUE_ORDER: setValueOrder,
  SHOW_COPY_NEW_MESSAGE: showCopyNewMessage,
  SHOW_DIACRITICS: showDiacriticsSelection,
  SHOW_GROUP_CHOOSER: showGroupChooser,
  SHOW_MODAL: showModal,
  SHOW_PROPERTY: showProperty,
  SHOW_VALIDATION_ERRORS: showValidationErrors,
  ADD_TEMPLATES: addTemplates,
  ADD_SUBJECT: addSubject,
  ADD_PROPERTY: addProperty,
  ADD_VALUE: addValue,
  REMOVE_VALUE: removeValue,
  REMOVE_SUBJECT: removeSubject,
}

const authHandlers = {
  SET_USER: setUser,
  REMOVE_USER: removeUser,
}

export const createReducer = (handlers) => (state = {}, action) => {
  const fn = handlers[action.type]
  return fn ? fn(state, action) : state
}

const appReducer = combineReducers({
  authenticate: createReducer(authHandlers),
  selectorReducer: createReducer(handlers),
})

export default appReducer
