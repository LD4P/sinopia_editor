// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { itemsSelected } from 'actions/index'
import {
  findNode, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'

import InputValue from './InputValue'
import { isValidURI } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'

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
      && Object.keys(props.items).length > 0

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

    props.itemsSelected(userInput)
    setContent('')
  }

  const handleKeypress = (event) => {
    if (event.key === 'Enter') {
      addItem()
      event.preventDefault()
    }
  }

  const handleEdit = (content) => {
    setContent(content)
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


  const itemKeys = Object.keys(props.items)
  const addedList = itemKeys.map(itemId => (<InputValue key={itemId}
                                                        handleEdit={handleEdit}
                                                        reduxPath={[...props.reduxPath, 'items', itemId]} />))

  let error
  let groupClasses = 'form-group'
  const errors = mergeErrors()
  if (!_.isEmpty(errors)) {
    groupClasses += ' has-error'
    error = errors.join(', ')
  }
  const id = shortid.generate()

  return (
    <div className={groupClasses}>
      <label htmlFor={id}>Enter a URI</label>
      <input id={id}
             required={required}
             className="form-control"
             placeholder={props.propertyTemplate.propertyLabel}
             onChange={event => setContent(event.target.value)}
             onKeyPress={handleKeypress}
             value={content}
             disabled={disabled}
             ref={inputLiteralRef}
      />
      {error && <span className="help-block">{error}</span>}
      {addedList}
    </div>
  )
}

InputURI.propTypes = {
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  items: PropTypes.object,
  itemsSelected: PropTypes.func,
  reduxPath: PropTypes.array.isRequired,
  displayValidations: PropTypes.bool,
  errors: PropTypes.array,
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  // items has to be its own prop or rerendering won't occur when one is removed
  const items = findNode(state, reduxPath).items
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findErrors(state, reduxPath)

  return {
    items,
    propertyTemplate,
    displayValidations,
    errors,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ itemsSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputURI)
