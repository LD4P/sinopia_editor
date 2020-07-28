// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { removeValue } from 'actions/resources'
import LanguageButton from './LanguageButton'
import { selectValue } from 'selectors/resources'

const InputValue = (props) => {
  if (!props.value) return null

  const isLiteral = props.value.property.propertyTemplate.type === 'literal'
  const label = props.value.literal || props.value.label || props.value.uri

  const handleEditClick = () => {
    props.handleEdit(label, props.value.lang)
    props.removeValue(props.valueKey)
  }

  return (<div id="userInput" style={{ marginTop: '.25em' }}>
    <div
      className="rbt-token rbt-token-removeable">
      {label}
      <button
        onClick={() => props.removeValue(props.valueKey)}
        aria-label={`Remove ${label}`}
        className="close rbt-close rbt-token-remove-button">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <button
      id="editItem"
      onClick={handleEditClick}
      style={ { marginRight: '.25em' } }
      aria-label={`Edit ${label}`}
      className="btn btn-sm btn-secondary btn-default">
      Edit
    </button>
    { isLiteral ? (<LanguageButton value={props.value} />) : '' }
  </div>)
}

InputValue.propTypes = {
  handleEdit: PropTypes.func.isRequired,
  removeValue: PropTypes.func.isRequired,
  valueKey: PropTypes.string.isRequired,
  value: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => ({
  value: selectValue(state, ownProps.valueKey),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputValue)
