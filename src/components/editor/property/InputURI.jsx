// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { displayResourceValidations } from 'selectors/errors'
import { addValue } from 'actions/resources'
import { newUriValue } from 'utilities/valueFactory'
import InputValue from './InputValue'
import { isValidURI } from 'utilities/Utilities'

import _ from 'lodash'

const InputURI = (props) => {
  const inputLiteralRef = useRef(Math.floor(100 * Math.random()))
  const [content, setContent] = useState('')
  const [uriError, setURIError] = useState(false)

  const disabled = !props.property.propertyTemplate.repeatable
      && props.property.values.length > 0

  const addItem = () => {
    const currentcontent = content.trim()

    if (!currentcontent) return

    if (!isValidURI(currentcontent)) {
      setURIError(true)
      return
    }
    setURIError(false)

    props.addValue(newUriValue(props.property.key, currentcontent, null))

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

  const required = props.property.propertyTemplate.required

  const mergeErrors = () => {
    let errors = []
    if (uriError) {
      errors.push('Not a valid URI.')
    }
    if (props.displayValidations && !_.isEmpty(props.property.errors)) {
      errors = errors.concat(props.property.errors)
    }
    return errors
  }

  const addedList = props.property.valueKeys.map((valueKey) => (<InputValue key={valueKey}
                                                                            handleEdit={handleEdit}
                                                                            valueKey={valueKey} />))

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
             placeholder={props.property.propertyTemplate.label}
             onChange={(event) => setContent(event.target.value)}
             onKeyPress={handleKeypress}
             value={content}
             disabled={disabled}
             onBlur={addItem}
             ref={inputLiteralRef}
      />
      {error && <span className="text-danger">{error}</span>}
      {addedList}
    </div>
  )
}

InputURI.propTypes = {
  property: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool,
  addValue: PropTypes.func,
}

const mapStateToProps = (state) => ({
  displayValidations: displayResourceValidations(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ addValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputURI)
