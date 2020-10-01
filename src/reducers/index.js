// Copyright 2018, 2019 Stanford University see LICENSE for license

import { combineReducers } from 'redux'
import {
  setUser, removeUser,
} from './authenticate'
import {
  setBaseURL, hideProperty, showProperty,
  setUnusedRDF, setCurrentResource, setCurrentResourceIsReadOnly,
  addSubject, addProperty, addValue, removeValue,
  removeSubject, clearResource,
  saveResourceFinished, loadResourceFinished,
  setResourceGroup, setValueOrder,
  clearResourceFromEditor, saveResourceFinishedEditor,
} from './resources'
import {
  setLanguage, languagesReceived,
} from './languages'
import {
  hideValidationErrors, addError, clearErrors,
  showValidationErrors,
} from './errors'
import {
  showModal, hideModal, addModalMessage, clearModalMessages,
} from './modals'
import { showCopyNewMessage } from './messages'
import {
  exportsReceived,
} from './exports'
import {
  addTemplates, addTemplateHistory, addTemplateHistoryByResult,
} from './templates'
import {
  clearSearchResults, setSearchResults,
} from './search'
import {
  lookupOptionsRetrieved,
} from './lookups'

export const setAppVersion = (state, action) => ({ ...state, version: action.payload })

export const setCurrentComponent = (state, action) => ({
  ...state,
  currentComponent: {
    ...state.currentComponent,
    [action.payload.rootSubjectKey]: {
      component: action.payload.key,
      property: action.payload.rootPropertyKey,
    },
  },
})

const authHandlers = {
  SET_USER: setUser,
  REMOVE_USER: removeUser,
}

const appHandlers = {
  SET_APP_VERSION: setAppVersion,
}

const editorHandlers = {
  ADD_ERROR: addError,
  ADD_MODAL_MESSAGE: addModalMessage,
  ADD_TEMPLATE_HISTORY: addTemplateHistory,
  ADD_TEMPLATE_HISTORY_BY_RESULT: addTemplateHistoryByResult,
  CLEAR_ERRORS: clearErrors,
  CLEAR_MODAL_MESSAGES: clearModalMessages,
  CLEAR_RESOURCE: clearResourceFromEditor,
  HIDE_MODAL: hideModal,
  HIDE_VALIDATION_ERRORS: hideValidationErrors,
  SAVE_RESOURCE_FINISHED: saveResourceFinishedEditor,
  SET_CURRENT_COMPONENT: setCurrentComponent,
  SET_CURRENT_RESOURCE: setCurrentResource,
  SET_CURRENT_RESOURCE_IS_READ_ONLY: setCurrentResourceIsReadOnly,
  SET_UNUSED_RDF: setUnusedRDF,
  SHOW_COPY_NEW_MESSAGE: showCopyNewMessage,
  SHOW_MODAL: showModal,
  SHOW_VALIDATION_ERRORS: showValidationErrors,
}

const entityHandlers = {
  ADD_PROPERTY: addProperty,
  ADD_SUBJECT: addSubject,
  ADD_TEMPLATES: addTemplates,
  ADD_VALUE: addValue,
  CLEAR_RESOURCE: clearResource,
  EXPORTS_RECEIVED: exportsReceived,
  HIDE_PROPERTY: hideProperty,
  LANGUAGES_RECEIVED: languagesReceived,
  LANGUAGE_SELECTED: setLanguage,
  LOAD_RESOURCE_FINISHED: loadResourceFinished,
  LOOKUP_OPTIONS_RETRIEVED: lookupOptionsRetrieved,
  REMOVE_SUBJECT: removeSubject,
  REMOVE_VALUE: removeValue,
  SAVE_RESOURCE_FINISHED: saveResourceFinished,
  SET_BASE_URL: setBaseURL,
  SET_RESOURCE_GROUP: setResourceGroup,
  SET_VALUE_ORDER: setValueOrder,
  SHOW_PROPERTY: showProperty,
}

const searchHandlers = {
  CLEAR_SEARCH_RESULTS: clearSearchResults,
  SET_SEARCH_RESULTS: setSearchResults,
}

export const createReducer = (handlers) => (state = {}, action) => {
  const fn = handlers[action.type]
  return fn ? fn(state, action) : state
}

const appReducer = combineReducers({
  authenticate: createReducer(authHandlers),
  app: createReducer(appHandlers),
  editor: createReducer(editorHandlers),
  entities: createReducer(entityHandlers),
  search: createReducer(searchHandlers),
})

export default appReducer
