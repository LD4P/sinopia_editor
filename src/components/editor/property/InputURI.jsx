// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { removeItem, itemsSelected } from 'actions/index'
import { findNode, getDisplayValidations, getPropertyTemplate } from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, isValidURI } from 'Utilities'

const InputURI = (props) => {
  // Don't render if don't have property templates yet.
  if (!props.propertyTemplate) {
    return null
  }

  const inputLiteralRef = useRef(Math.floor(100 * Math.random()))
  const [content, setContent] = useState('')

  const disabled = !booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)
      && props.items?.length > 0

  const handleFocus = (event) => {
    document.getElementById(event.target.id).focus()
    event.preventDefault()
  }

  const addItem = () => {
    const currentcontent = content.trim()

    if (!currentcontent || !isValidURI(currentcontent)) {
      return
    }

    const userInput = {
      reduxPath: props.reduxPath,
      items: [{ uri: currentcontent, id: shortid.generate() }],
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
      && props.formData.errors
      && props.formData.errors.length !== 0

  const items = props.items || []

  const addedList = items.map((obj) => {
    const itemId = obj.id || shortid.generate()

    return <div id="userInput" key = {itemId} >
      {obj.uri}
      <button
        id="deleteItem"
        type="button"
        onClick={handleDeleteClick}
        key={`delete${obj.id}`}
        data-item={itemId}
        data-label={props.formData.uri}
      >X
      </button>
      <button
        id="editItem"
        type="button"
        onClick={handleEditClick}
        key={`edit${obj.id}`}
        data-item={itemId}
        data-label={props.formData.uri}
      >Edit
      </button>
    </div>
  })

  const error = props.displayValidations && required ? 'Required' : undefined
  let groupClasses = 'form-group'

  if (error) {
    groupClasses += ' has-error'
  }

  return (
    <div className={groupClasses}>
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
  formData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uri: PropTypes.string,
    errors: PropTypes.array,
  }),
  items: PropTypes.array,
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const formData = findNode(state.selectorReducer, reduxPath)
  // items has to be its own prop or rerendering won't occur when one is removed
  const items = formData.items
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)

  return {
    formData,
    items,
    propertyTemplate,
    displayValidations,
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
