// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import shortid from 'shortid'
import {
  itemsSelected, closeDiacritics, showDiacritics, setLiteralContent,
} from 'actions/index'
import {
  findNode, getDisplayResourceValidations, getPropertyTemplate, findResourceValidationErrorsByPath,
} from 'selectors/resourceSelectors'
import InputValue from './InputValue'
import { defaultLanguageId } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import _ from 'lodash'

const InputLiteral = (props) => {
  const inputLiteralRef = useRef(100 * Math.random())
  const [lang, setLang] = useState(defaultLanguageId)
  const id = `inputliteral-${props.reduxPath.join('')}`

  // Don't render if don't have property templates yet.
  if (!props.propertyTemplate) {
    return null
  }

  const disabled = !booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)
      && Object.keys(props.items).length > 0

  const addItem = () => {
    let currentcontent = props.content.trim()
    if (!currentcontent && !props.shouldShowDiacritic) {
      return
    }

    if (props.shouldShowDiacritic && !currentcontent) {
      currentcontent = inputLiteralRef.current.value
    }
    const userInput = {
      reduxPath: props.reduxPath,
      items: {
        [shortid.generate()]: { content: currentcontent, lang },
      },
    }
    props.itemsSelected(userInput)
    props.setLiteralContent('', props.reduxPath)
    setLang(defaultLanguageId)
  }

  const handleKeypress = (event) => {
    if (event.key === 'Enter') {
      addItem()
      props.closeDiacritics()
      event.preventDefault()
    }
  }

  const handleEdit = (content, lang) => {
    props.setLiteralContent(content, props.reduxPath)
    setLang(lang)
    inputLiteralRef.current.focus()
  }

  const toggleDiacritics = (event) => {
    if (props.shouldShowDiacritic) {
      props.closeDiacritics(props.reduxPath)
    } else {
      props.showDiacritics(props.reduxPath)
    }
    event.preventDefault()
  }

  const itemKeys = Object.keys(props.items)
  const addedList = itemKeys.map((itemId) => (<InputValue key={itemId}
                                                          handleEdit={handleEdit}
                                                          reduxPath={[...props.reduxPath, 'items', itemId]} />))


  const required = booleanPropertyFromTemplate(props.propertyTemplate, 'mandatory', false)

  let error
  let groupClasses = 'form-group'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
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
    if (!focusIn(e, 'diacritics-selection') && !focusIn(e, id) && props.content.length > 0) {
      addItem()
      props.closeDiacritics(props.reduxPath)
    }
  }

  return (
    <div className={groupClasses}>
      <div className="input-group" onBlur={handleBlur} id={id}>
        <input
              required={required}
              className="form-control"
              placeholder={props.propertyTemplate.propertyLabel}
              onChange={(event) => props.setLiteralContent(event.target.value, props.reduxPath)}
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
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  errors: PropTypes.array,
  content: PropTypes.string,
  items: PropTypes.object,
  shouldShowDiacritic: PropTypes.bool,
  closeDiacritics: PropTypes.func,
  showDiacritics: PropTypes.func,
  itemsSelected: PropTypes.func,
  reduxPath: PropTypes.array.isRequired,
  displayValidations: PropTypes.bool,
  setLiteralContent: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayResourceValidations(state)
  const formData = findNode(state, reduxPath)
  const errors = findResourceValidationErrorsByPath(state, reduxPath)
  const shouldShowDiacritic = state.selectorReducer.editor.diacritics.show
  // items has to be its own prop or rerendering won't occur when one is removed
  const items = formData.items || {}
  const content = formData.content || ''
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  return {
    items,
    propertyTemplate,
    displayValidations,
    shouldShowDiacritic,
    errors,
    content,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  itemsSelected, closeDiacritics, showDiacritics, setLiteralContent,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
