// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Alert from '../Alert'

const ErrorMessages = (props) => {
  if (!props.displayValidations || props.errors.length === 0) {
    return null
  }


  const errorList = props.errors.map(elem => (<li key={elem.reduxPath.join('-')}>{elem.path.join(' > ')}: {elem.message}</li>))
  const text = (<span>There was a problem saving this resource. Validation errors: <ul>{ errorList }</ul></span>)
  return (
    <Alert text={text}/>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = state => ({
  errors: state.selectorReducer.editor.errors[state.selectorReducer.editor.currentResource],
  displayValidations: state.selectorReducer.editor.displayValidations,
})

export default connect(mapStateToProps, {})(ErrorMessages)
