// Copyright 2018, 2019 Stanford University see LICENSE for license

import Validator from '../ResourceValidator'
import { findObjectAtPath } from 'selectors/resourceSelectors'

export const validate = (state) => {
  const newState = { ...state }
  const result = new Validator(newState).validate()
  newState.editor.resourceValidationErrors = result[0]
  newState.editor.errors = result[1]
  return newState
}

/**
 * Open the group choice dialog if the object is valid
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showGroupChooser = (state) => {
  const newState = { ...state }

  if (validate(state).editor.errors.length === 0) {
    // Show the window to select a group
    newState.editor.groupChoice.show = true
  } else {
    // Show errors that prevent save
    newState.editor.displayValidations = true
    newState.editor.rdfPreview.show = false
  }

  return newState
}

/**
 * Close the group chooser
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const closeGroupChooser = (state) => {
  const newState = { ...state }

  newState.editor.groupChoice.show = false

  return newState
}

/**
 * Opens the resource template chooser
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const showResourceTemplateChooser = (state) => {
  const newState = { ...state }

  newState.editor.resourceTemplateChoice.show = true

  return newState
}

/**
 * Closes the resource template chooser
 * @param {Object} state the previous redux state
 * @return {Object} the next redux state
 */
export const closeResourceTemplateChooser = (state) => {
  const newState = { ...state }

  newState.editor.resourceTemplateChoice.show = false

  return newState
}

/**
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is a boolean that says to show or not to show the preview
 * @return {Object} the next redux state
 */
export const showRdfPreview = (state, action) => {
  const newState = { ...state }

  newState.editor.rdfPreview.show = action.payload
  return newState
}

/**
 * @param {Object} state the previous redux state
 * @param {Object} action the payload of the action is a boolean that says to show or not to show the CopyNewMessage
 * @return {Object} the next redux state
 */
export const showCopyNewMessage = (state, action) => {
  const newState = { ...state }

  newState.editor.copyToNewMessage.show = action.payload.show
  if (action.payload.oldUri !== undefined) {
    newState.editor.copyToNewMessage.oldUri = action.payload.oldUri
  }
  return newState
}

/**
 * Takes the reduxPath (an array of keys that correspond to the redux state tree for a 'resource') and performs a reduce
 * function on each of the keys, searching for the last key in the path and then appending an object with an `items` array.
 * Also checks for needed blank nodes along the reduxPath in the state tree and appends intermediate objects.
 *
 * Each item in the items array MUST have the following keys:
 *  label - the string value to show
 *  uri - the URI that represents the concept
 *
 * * @returns {function} a function that validates the content of the `newState` object.
 */
export const setItemsOrSelections = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload.reduxPath
  let level = 0
  reduxPath.reduce((obj, key) => {
    level++
    // we've reached the end of the reduxPath, so set the items with the user input
    if (level === reduxPath.length) {
      /* there is an empty object at the end of the reduxPath,
       * so make an object with items to be filled in by the actions below
       */
      if ((key in obj) !== true || !Object.keys(obj[key]).includes('items')) {
        obj[key] = { items: {} }
      }

      if (action.type === 'ITEMS_SELECTED') {
        // here we are setting the items for repeatable user input, so push back each input item
        Object.keys(action.payload.items).forEach((rowId) => {
          obj[key].items[rowId] = action.payload.items[rowId]
        })
      }
      else if (action.type === 'CHANGE_SELECTIONS') {
      /* here we are setting the selections from one of the typeahead components
       * and the component keeps the state of all its selections
       */
        obj[key].items = action.payload.items
      }
    }

    /* there is no corresponding object for the blank node key
     * here we create a blank node object to be filled in with an entity further down the reduxPath
     */
    if (!Object.keys(obj).includes(key)) {
      obj[key] = {}
    }

    // return the next object in the tree with the key, which is the parent object id
    return obj[key]
  }, newState)
  return validate(newState)
}

export const setMyItemsLang = (state, action) => {
  const newState = { ...state }
  const node = findObjectAtPath(newState, action.payload.reduxPath)

  node.lang = action.payload.lang

  return newState
}

export const setBaseURL = (state, action) => {
  const newState = { ...state }

  // Is there ever more than one base node?
  Object.values(newState.resource).forEach((value) => {
    value.resourceURI = action.payload
  })
  return newState
}

export const removeMyItem = (state, action) => {
  const newState = { ...state }
  const reduxPath = action.payload

  const node = findObjectAtPath(newState, reduxPath.slice(0, -1))
  delete node[reduxPath.slice(-1)[0]]

  return validate(newState)
}
