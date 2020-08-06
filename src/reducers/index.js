// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import authenticate from './authenticate'
import {
  setLiteralInputContent, hideDiacriticsSelection, showDiacriticsSelection,
} from './inputs'
import {
  setBaseURL, hideProperty, showProperty,
  setUnusedRDF, setCurrentResource,
  addSubject, addProperty, addValue, removeValue,
  removeProperty, removeSubject, clearResource,
  saveResourceFinished, loadResourceFinished,
  setResourceGroup,
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
import {
  setTemplateMessages, clearTemplateMessages, showCopyNewMessage,
} from './messages'
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

const handlers = {
  ADD_MODAL_MESSAGE: addModalMessage,
  ADD_TEMPLATE_HISTORY: addTemplateHistory,
  ADD_ERROR: addError,
  CLEAR_ERRORS: clearErrors,
  CLEAR_MODAL_MESSAGES: clearModalMessages,
  CLEAR_TEMPLATE_MESSAGES: clearTemplateMessages,
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
  SET_CURRENT_RESOURCE: setCurrentResource,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_TEMPLATE_MESSAGES: setTemplateMessages,
  SET_SEARCH_RESULTS: setSearchResults,
  SET_TEMPLATE_SEARCH_RESULTS: setTemplateSearchResults,
  SET_UNUSED_RDF: setUnusedRDF,
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
  REMOVE_PROPERTY: removeProperty,
}

export const createReducer = (handlers) => (state = {}, action) => {
  const fn = handlers[action.type]
  return fn ? fn(state, action) : state
}

const appReducer = combineReducers({
  authenticate,
  selectorReducer: createReducer(handlers),
})

export default appReducer
