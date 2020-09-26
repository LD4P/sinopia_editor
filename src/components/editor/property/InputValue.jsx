// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect, useSelector } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { removeValue } from 'actions/resources'
import LanguageButton from './LanguageButton'
import { selectCurrentResourceIsReadOnly, selectNormValue, selectNormProperty } from 'selectors/resources'
import { selectPropertyTemplate } from 'selectors/templates'

const InputValue = (props) => {
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))

  if (!props.value) return null

  const isLiteral = props.propertyTemplate.type === 'literal'
  const label = props.value.literal || props.value.label || props.value.uri

  const handleEditClick = () => {
    props.removeValue(props.valueKey)
    props.handleEdit(label, props.value.lang)
  }

  return (<div className="input-value">
    <div
      className="rbt-token rbt-token-removeable">
      {label}
      <button
        disabled={readOnly}
        onClick={() => props.removeValue(props.valueKey)}
        aria-label={`Remove ${label}`}
        data-testid={`Remove ${label}`}
        className="close rbt-close rbt-token-remove-button">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    {props.handleEdit && <button
      disabled={readOnly}
      onClick={handleEditClick}
      style={ { marginRight: '.25em' } }
      aria-label={`Edit ${label}`}
      data-testid={`Edit ${label}`}
      className="btn btn-sm btn-secondary btn-default">
      Edit
    </button> }
    { isLiteral ? (<LanguageButton value={props.value} />) : '' }
  </div>)
}

InputValue.propTypes = {
  handleEdit: PropTypes.func,
  removeValue: PropTypes.func.isRequired,
  valueKey: PropTypes.string.isRequired,
  value: PropTypes.object,
  propertyTemplate: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const value = selectNormValue(state, ownProps.valueKey)
  const property = selectNormProperty(state, value?.propertyKey)
  return {
    value,
    propertyTemplate: selectPropertyTemplate(state, property?.propertyTemplateKey),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ removeValue }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputValue)
