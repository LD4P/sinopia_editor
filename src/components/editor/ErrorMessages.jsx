// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { findNode } from 'selectors/resourceSelectors'

const ErrorMessages = (props) => {
  if (!props.displayValidations || props.errors.length === 0) {
    return null
  }

  const errorList = props.errors.map(elem => (<li key={elem.path.join('-')}>{elem.label} {elem.message}</li>))

  return (
    <div className="row">
      <div className="col-md-12" style={{ marginTop: '10px' }}>
        <div className="alert alert-danger alert-dismissible">
          <button className="close" data-dismiss="alert" aria-label="close">&times;</button>
          There was a probem saving this resource. Validation errors: <ul>{errorList}</ul>
        </div>
      </div>
    </div>
  )
}

ErrorMessages.propTypes = {
  errors: PropTypes.array,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = state => ({
  errors: findNode(state.selectorReducer, ['editor']).errors,
  displayValidations: state.selectorReducer.editor.displayValidations,
})

export default connect(mapStateToProps, {})(ErrorMessages)
