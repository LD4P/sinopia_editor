// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { displayResourceValidations, selectCurrentResourceValidationErrors } from 'selectors/errors'
import Alert from '../Alert'

const ErrorMessages = (props) => {
  if (!props.displayValidations || props.errors.length === 0) {
    return null
  }

  const errorList = props.errors.map((error) => (<li key={error.propertyKey + error.message}>{error.labelPath.join(' > ')}: {error.message}</li>))
  const text = (<span>Unable to save this resource. Validation errors: <ul>{ errorList }</ul></span>)
  return (
    <Alert text={text}/>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state) => ({
  errors: selectCurrentResourceValidationErrors(state),
  displayValidations: displayResourceValidations(state),
})

export default connect(mapStateToProps, {})(ErrorMessages)
