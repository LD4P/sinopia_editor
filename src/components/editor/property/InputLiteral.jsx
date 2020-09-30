// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'
import {
  hideDiacritics, showDiacritics,
  setLiteralContent, updateCursorPosition,
} from 'actions/inputs'
import { displayResourceValidations } from 'selectors/errors'
import { selectCurrentResourceIsReadOnly } from 'selectors/resources'
import InputValue from './InputValue'
import { defaultLanguageId } from 'utilities/Utilities'
import _ from 'lodash'
import { addValue } from 'actions/resources'
import { newLiteralValue } from 'utilities/valueFactory'
import { selectLiteralInputContent, displayDiacritics } from 'selectors/inputs'

const InputLiteral = (props) => {
  const inputLiteralRef = useRef(100 * Math.random())
  const [lang, setLang] = useState(defaultLanguageId)
  const id = `inputliteral-${props.property.key}`
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))

  const disabled = readOnly || (!props.propertyTemplate.repeatable
                                && props.property.valueKeys.length > 0)

  const addItem = () => {
    let currentcontent = props.content.trim()
    if (!currentcontent && !props.shouldShowDiacritic) {
      return
    }

    if (props.shouldShowDiacritic && !currentcontent) {
      currentcontent = inputLiteralRef.current.value
    }

    props.addValue(newLiteralValue(props.property, currentcontent, lang))
    props.setLiteralContent(props.property.key, '')
    setLang(defaultLanguageId)
  }

  const handleKeypress = (event) => {
    if (event.key === 'Enter') {
      addItem()
      props.hideDiacritics()
      event.preventDefault()
    }
    // Handle any position changing
    props.updateCursorPosition(inputLiteralRef.current.selectionStart)
  }

  const handleEdit = (content, lang) => {
    props.setLiteralContent(props.property.key, content)
    setLang(lang)
    inputLiteralRef.current.focus()
  }

  const toggleDiacritics = (event) => {
    if (props.shouldShowDiacritic) {
      props.hideDiacritics()
    } else {
      props.updateCursorPosition(inputLiteralRef.current.selectionStart)
      props.showDiacritics(props.property.key)
    }
    event.preventDefault()
  }

  const addedList = props.property.valueKeys.map((valueKey) => (<InputValue key={valueKey}
                                                                            handleEdit={handleEdit}
                                                                            valueKey={valueKey} />))
  const required = props.propertyTemplate.required

  let error
  let controlClasses = 'form-control'
  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    controlClasses += ' is-invalid'
    error = props.property.errors.join(',')
  }

  const focusIn = (event, checkId) => {
    if (event.relatedTarget === null) return false

    let node = event.relatedTarget

    while (node !== null) {
      if (node.id === checkId) return true
      node = node.parentNode
    }

    return false
  }

  const hasInput = () => !_.isEmpty(props.content)

  const handleBlur = (e) => {
    if (focusIn(e, 'diacritics-selection') || focusIn(e, id)) {
      return
    }

    if (hasInput()) {
      addItem()
      props.hideDiacritics()
    }
  }

  // This handles if they change the cursor position within the field after the focus event.
  const handleClick = () => {
    props.updateCursorPosition(inputLiteralRef.current.selectionStart)
  }

  // This handles if they focus into the field using tab (no click)
  const handleFocus = () => {
    props.hideDiacritics() // hide any previously opened diacritic panels to avoid cross input problems
    props.updateCursorPosition(inputLiteralRef.current.selectionStart)
  }

  return (
    <div className="form-group">
      <div className="input-group" onBlur={handleBlur} id={id}>
        <TextareaAutosize
              required={required}
              className={controlClasses}
              placeholder={props.propertyTemplate.label}
              onChange={(event) => props.setLiteralContent(props.property.key, event.target.value)}
              onKeyPress={handleKeypress}
              onFocus={handleFocus}
              onClick={handleClick}
              value={props.content}
              disabled={disabled}
              ref={inputLiteralRef}
        />
        <div className="input-group-append" tabIndex="0">
          <button className="btn btn-outline-primary"
                  disabled={disabled}
                  onClick={toggleDiacritics}>&auml;</button>
        </div>
        {error && <span className="invalid-feedback">{error}</span>}
      </div>
      {addedList}
    </div>
  )
}

InputLiteral.propTypes = {
  shouldShowDiacritic: PropTypes.bool,
  hideDiacritics: PropTypes.func,
  showDiacritics: PropTypes.func,
  displayValidations: PropTypes.bool,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  addValue: PropTypes.func,
  content: PropTypes.string,
  setLiteralContent: PropTypes.func,
  updateCursorPosition: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  displayValidations: displayResourceValidations(state, ownProps.property?.rootSubjectKey),
  shouldShowDiacritic: displayDiacritics(state),
  content: selectLiteralInputContent(state, ownProps.property?.key) || '',
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  hideDiacritics, showDiacritics, addValue, setLiteralContent, updateCursorPosition,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
