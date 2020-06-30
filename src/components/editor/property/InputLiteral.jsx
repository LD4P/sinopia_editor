// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  hideDiacritics, showDiacritics,
  setLiteralContent,
} from 'actions/inputs'
import { displayResourceValidations } from 'selectors/errors'
import InputValue from './InputValue'
import { defaultLanguageId } from 'utilities/Utilities'
import _ from 'lodash'
import { selectProperty } from 'selectors/resources'
import { addValue } from 'actions/resources'
import { newLiteralValue } from 'utilities/valueFactory'
import { selectLiteralInputContent } from 'selectors/inputs'


const InputLiteral = (props) => {
  const inputLiteralRef = useRef(100 * Math.random())
  const [lang, setLang] = useState(defaultLanguageId)
  const id = `inputliteral-${props.propertyKey}`

  const disabled = !props.property.propertyTemplate.repeatable
      && props.property.values.length > 0

  const addItem = () => {
    let currentcontent = props.content.trim()
    if (!currentcontent && !props.shouldShowDiacritic) {
      return
    }

    if (props.shouldShowDiacritic && !currentcontent) {
      currentcontent = inputLiteralRef.current.value
    }

    props.addValue(newLiteralValue(props.propertyKey, currentcontent, lang))
    props.setLiteralContent(props.propertyKey, '')
    setLang(defaultLanguageId)
  }

  const handleKeypress = (event) => {
    if (event.key === 'Enter') {
      addItem()
      props.hideDiacritics()
      event.preventDefault()
    }
  }

  const handleEdit = (content, lang) => {
    props.setLiteralContent(props.propertyKey, content)
    setLang(lang)
    inputLiteralRef.current.focus()
  }

  const toggleDiacritics = (event) => {
    if (props.shouldShowDiacritic) {
      props.hideDiacritics()
    } else {
      props.showDiacritics(props.propertyKey)
    }
    event.preventDefault()
  }

  const addedList = props.property.valueKeys.map((valueKey) => (<InputValue key={valueKey}
                                                                            handleEdit={handleEdit}
                                                                            valueKey={valueKey} />))

  const required = props.property.propertyTemplate.required

  let error
  let groupClasses = 'form-group'

  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    groupClasses += ' has-error'
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

  const handleBlur = (e) => {
    if (!focusIn(e, 'diacritics-selection') && !focusIn(e, id) && props.property.valueKeys.length > 0) {
      addItem()
      props.hideDiacritics()
    }
  }

  return (
    <div className={groupClasses}>
      <div className="input-group" onBlur={handleBlur} id={id}>
        <input
              required={required}
              className="form-control"
              placeholder={props.property.propertyTemplate.label}
              onChange={(event) => props.setLiteralContent(props.propertyKey, event.target.value)}
              onKeyPress={handleKeypress}
              value={props.content}
              disabled={disabled}
              ref={inputLiteralRef}
        />
        <div className="input-group-append" tabIndex="0">
          <button className="btn btn-outline-primary"
                  disabled={disabled}
                  onClick={toggleDiacritics}>&auml;</button>
        </div>
      </div>
      {error && <span className="text-danger">{error}</span>}
      {addedList}
    </div>
  )
}

InputLiteral.propTypes = {
  shouldShowDiacritic: PropTypes.bool,
  hideDiacritics: PropTypes.func,
  showDiacritics: PropTypes.func,
  displayValidations: PropTypes.bool,
  propertyKey: PropTypes.string,
  property: PropTypes.object,
  addValue: PropTypes.func,
  content: PropTypes.string,
  setLiteralContent: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  displayValidations: displayResourceValidations(state),
  shouldShowDiacritic: state.selectorReducer.editor.diacritics.show,
  property: selectProperty(state, ownProps.propertyKey),
  content: selectLiteralInputContent(state, ownProps.propertyKey) || '',
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  hideDiacritics, showDiacritics, addValue, setLiteralContent,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
