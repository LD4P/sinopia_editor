// Copyright 2019 Stanford University see LICENSE for license

import React, { useRef, useState } from "react"
import PropTypes from "prop-types"
import { bindActionCreators } from "redux"
import { connect, useSelector } from "react-redux"
import { nanoid } from "nanoid"
import { displayResourceValidations } from "selectors/errors"
import { selectCurrentResourceIsReadOnly } from "selectors/resources"
import { addValue } from "actions/resources"
import { newUriValue } from "utilities/valueFactory"
import InputValue from "./InputValue"
import { isValidURI } from "utilities/Utilities"

import _ from "lodash"

const InputURI = (props) => {
  const inputLiteralRef = useRef(Math.floor(100 * Math.random()))
  const [content, setContent] = useState("")
  const [uriError, setURIError] = useState(false)
  const readOnly = useSelector((state) =>
    selectCurrentResourceIsReadOnly(state)
  )

  const disabled =
    readOnly ||
    (!props.propertyTemplate.repeatable && props.property.valueKeys.length > 0)

  const addItem = () => {
    const currentcontent = content.trim()

    if (!currentcontent) return

    if (!isValidURI(currentcontent)) {
      setURIError(true)
      return
    }
    setURIError(false)

    props.addValue(newUriValue(props.property, currentcontent, null))

    setContent("")
  }

  const handleKeypress = (event) => {
    if (event.key === "Enter") {
      addItem()
      event.preventDefault()
    }
  }

  const handleEdit = (content) => {
    setContent(content)
    inputLiteralRef.current.focus()
  }

  const required = props.propertyTemplate.required

  const mergeErrors = () => {
    let errors = []
    if (uriError) {
      errors.push("Not a valid URI.")
    }
    if (props.displayValidations && !_.isEmpty(props.property.errors)) {
      errors = errors.concat(props.property.errors)
    }
    return errors
  }

  const addedList = props.property.valueKeys.map((valueKey) => (
    <InputValue key={valueKey} handleEdit={handleEdit} valueKey={valueKey} />
  ))

  let error
  let controlClasses = "form-control"
  const errors = mergeErrors()
  if (!_.isEmpty(errors)) {
    controlClasses += " is-invalid"
    error = errors.join(", ")
  }
  const id = nanoid()

  return (
    <div className="form-group">
      <label htmlFor={id}>Enter a URI</label>
      <input
        id={id}
        required={required}
        className={controlClasses}
        placeholder={props.propertyTemplate.label}
        onChange={(event) => setContent(event.target.value)}
        onKeyPress={handleKeypress}
        value={content}
        disabled={disabled}
        onBlur={addItem}
        ref={inputLiteralRef}
      />
      {error && <span className="invalid-feedback">{error}</span>}
      {addedList}
    </div>
  )
}

InputURI.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  displayValidations: PropTypes.bool,
  addValue: PropTypes.func,
}

const mapStateToProps = (state, ownProps) => ({
  displayValidations: displayResourceValidations(
    state,
    ownProps.property?.rootSubjectKey
  ),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ addValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputURI)
