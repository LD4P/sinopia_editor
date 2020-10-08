// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect, useSelector } from 'react-redux'
import TextareaAutosize from 'react-textarea-autosize'
import { displayResourceValidations } from 'selectors/errors'
import { selectCurrentResourceIsReadOnly } from 'selectors/resources'
import InputValue from './InputValue'
import { defaultLanguageId } from 'utilities/Utilities'
import _ from 'lodash'
import { addValue } from 'actions/resources'
import { newLiteralValue } from 'utilities/valueFactory'
import DiacriticsSelection from 'components/editor/diacritics/DiacriticsSelection'
import useDiacritics from 'hooks/useDiacritics'

const InputLiteral = (props) => {
  const inputLiteralRef = useRef(null)
  const [lang, setLang] = useState(defaultLanguageId)
  const {
    clearContent, handleKeyDownDiacritics, handleChangeDiacritics,
    handleBlurDiacritics, toggleDiacritics, closeDiacritics,
    handleAddCharacter, handleClickDiacritics,
    currentContent, setCurrentContent, showDiacritics,
  } = useDiacritics(inputLiteralRef, id, diacriticsId)
  const id = `inputliteral-${props.property.key}`
  const diacriticsId = `diacritics-${props.property.key}`
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))

  const disabled = readOnly || (!props.propertyTemplate.repeatable
                                && props.property.valueKeys.length > 0)


  const addItem = () => {
    if (_.isEmpty(currentContent.trim())) return

    props.addValue(newLiteralValue(props.property, currentContent.trim(), lang))
    clearContent()
    closeDiacritics()
    setLang(defaultLanguageId)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addItem()
      event.preventDefault()
    }
    // Handle any position changing
    handleKeyDownDiacritics(event)
  }

  const handleEdit = (content, lang) => {
    setCurrentContent(content)
    setLang(lang)
    inputLiteralRef.current.focus()
  }

  const handleBlur = (event) => {
    if (handleBlurDiacritics(event)) {
      addItem()
    }
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

  // TextareaAutosize does not disable well, so using a disabled input.
  return (
    <div className="form-group">
      <div className="input-group" onBlur={handleBlur} id={id}>
        { disabled ? <input
                        type="text"
                        disabled={true}
                        className="form-control"
                        placeholder={props.propertyTemplate.label}
                        value=""
                        ref={inputLiteralRef} />
          : <TextareaAutosize
              required={required}
              className={controlClasses}
              placeholder={props.propertyTemplate.label}
              onChange={handleChangeDiacritics}
              onKeyDown={handleKeyDown}
              onClick={handleClickDiacritics}
              value={currentContent}
              ref={inputLiteralRef} />
        }
        <div className="input-group-append" tabIndex="0">
          <button className="btn btn-outline-primary"
                  disabled={disabled}
                  aria-label={`Select diacritics for ${props.propertyTemplate.label}`}
                  data-testid={`Select diacritics for ${props.propertyTemplate.label}`}
                  onClick={toggleDiacritics}>&auml;</button>
        </div>
        {error && <span className="invalid-feedback">{error}</span>}
      </div>
      {addedList}
      <DiacriticsSelection
          id={diacriticsId}
          handleAddCharacter={handleAddCharacter}
          closeDiacritics={closeDiacritics}
          showDiacritics={showDiacritics} />
    </div>
  )
}

InputLiteral.propTypes = {
  displayValidations: PropTypes.bool,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  addValue: PropTypes.func,
  content: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  displayValidations: displayResourceValidations(state, ownProps.property?.rootSubjectKey),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ addValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
