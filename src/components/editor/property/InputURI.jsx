// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { removeItem, itemsSelected } from 'actions/index'
import {
  findNode, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, isValidURI } from 'Utilities'
import _ from 'lodash'

const InputURI = (props) => {
  // Don't render if don't have property templates yet.
  if (!props.propertyTemplate) {
    return null
  }

  const inputLiteralRef = useRef(Math.floor(100 * Math.random()))
  const [content, setContent] = useState('')
  const [uriError, setURIError] = useState(false)

  const disabled = !booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)
      && props.items?.length > 0

  const handleFocus = (event) => {
    document.getElementById(event.target.id).focus()
    event.preventDefault()
  }

  const addItem = () => {
    const currentcontent = content.trim()

    if (!currentcontent || !isValidURI(currentcontent)) {
      setURIError(true)
      return
    }
    setURIError(false)

    const userInput = {
      reduxPath: props.reduxPath,
      items: {
        [shortid.generate()]: { uri: currentcontent },
      },
    }

    props.handleMyItemsChange(userInput)
    setContent('')
  }

  const handleKeypress = (event) => {
    if (event.key === 'Enter') {
      addItem()
      event.preventDefault()
    }
  }

  const handleDeleteClick = (event) => {
    props.handleRemoveItem(props.reduxPath, event.target.dataset.item)
  }

  const handleEditClick = (event) => {
    const idToRemove = event.target.dataset.item

    props.items.forEach((item) => {
      if (item.id === idToRemove) {
        const itemContent = item.uri

        setContent(itemContent)
      }
    })

    handleDeleteClick(event)
    inputLiteralRef.current.focus()
  }

  /**
   * @return {bool} true if the field should be marked as required (e.g. not all obligations met)
   */
  const required = booleanPropertyFromTemplate(props.propertyTemplate, 'mandatory', false)

  const mergeErrors = () => {
    let errors = []
    if (uriError) {
      errors.push('Not a valid URI.')
    }
    if (props.displayValidations && !_.isEmpty(props.errors)) {
      errors = errors.concat(props.errors)
    }
    return errors
  }

  const addedList = Object.keys(props.items).map(itemId => (
    <div id="userInput" key={itemId}>
      {props.items[itemId].uri}
      <button
        id="deleteItem"
        type="button"
        onClick={handleDeleteClick}
        key={`delete${itemId}`}
        data-item={itemId}
      >X
      </button>
      <button
        id="editItem"
        type="button"
        onClick={handleEditClick}
        key={`edit${itemId}`}
        data-item={itemId}
      >Edit
      </button>
    </div>
  ))

  let error
  let groupClasses = 'form-group'
  const errors = mergeErrors()
  if (!_.isEmpty(errors)) {
    groupClasses += ' has-error'
    error = errors.join(', ')
  }
  return (
    <div className={groupClasses}>
      <label htmlFor={props.id}>Enter a URI</label>
      <input
            required={required}
            className="form-control"
            placeholder={props.propertyTemplate.propertyLabel}
            onChange={event => setContent(event.target.value)}
            onKeyPress={handleKeypress}
            value={content}
            disabled={disabled}
            id={props.id}
            onClick={handleFocus}
            ref={inputLiteralRef}
      />
      {error && <span className="help-block">{error}</span>}
      {addedList}
    </div>
  )
}

InputURI.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  items: PropTypes.object,
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
  errors: PropTypes.array,
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  // items has to be its own prop or rerendering won't occur when one is removed
  const items = findNode(state.selectorReducer, reduxPath).items
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findErrors(state.selectorReducer, reduxPath)

  return {
    items,
    propertyTemplate,
    displayValidations,
    errors,
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(itemsSelected(userInput))
  },
  handleRemoveItem(reduxPath, itemId) {
    dispatch(removeItem(reduxPath, itemId))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputURI)
