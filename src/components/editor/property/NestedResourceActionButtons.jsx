// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { resourceEditErrorKey } from '../Editor'
import {
  selectCurrentResourceKey, selectNormProperty, selectNormSubject,
  selectNormValues,
} from 'selectors/resources'
import { selectPropertyTemplate, selectSubjectTemplate } from 'selectors/templates'
import { addSiblingValueSubject } from 'actionCreators/resources'
import { removeValue, setValueOrder } from 'actions/resources'
import _ from 'lodash'

const NestedResourceActionButtons = (props) => {
  // Show add button if repeatable and first value.
  const showAddButton = props.propertyTemplate.repeatable && props.value.key === _.first(props.siblingValues).key
  // Show delete button if more than one.
  const showRemoveButton = props.siblingValues.length > 1
  const showMoveUpButton = props.propertyTemplate.ordered && props.index > 1
  const showMoveDownButton = props.propertyTemplate.ordered && props.index < props.property.valueKeys.length

  const addAnother = (event) => {
    event.preventDefault()
    return props.addSiblingValueSubject(_.last(props.siblingValues).key, resourceEditErrorKey(props.resourceKey))
  }

  const moveUp = (event) => {
    props.setValueOrder(props.value.key, props.index - 1)
    event.preventDefault()
  }

  const moveDown = (event) => {
    props.setValueOrder(props.value.key, props.index + 1)
    event.preventDefault()
  }

  const removeValue = (event) => {
    props.removeValue(props.value.key)
    event.preventDefault()
  }

  return (<div className="btn-group pull-right" role="group">
    { showAddButton
      && <button
          className="btn btn-sm btn-add-property btn-add-another"
          aria-label={`Add another ${props.subjectTemplate.label}`}
          data-testid={`Add another ${props.subjectTemplate.label}`}
          onClick={addAnother}>+ Add another</button>
    }
    { showRemoveButton
      && <button
        className="btn btn-sm btn-remove-another btn-nested-resource"
        aria-label={`Remove ${props.subjectTemplate.label}`}
        data-testid={`Remove ${props.subjectTemplate.label}`}
        onClick={removeValue}><FontAwesomeIcon icon={faTrashAlt} /></button>
    }
    { showMoveUpButton
      && <button
          className="btn btn-sm btn-nested-resource btn-moveup"
          aria-label={`Move up ${props.subjectTemplate.label}`}
          data-testid={`Move up ${props.subjectTemplate.label}`}
          onClick={moveUp}><FontAwesomeIcon icon={faArrowUp} /></button>
    }
    { showMoveDownButton
      && <button
          className="btn btn-sm btn-nested-resource btn-movedown"
          aria-label={`Move down ${props.subjectTemplate.label}`}
          data-testid={`Move down ${props.subjectTemplate.label}`}
          onClick={moveDown}><FontAwesomeIcon icon={faArrowDown} /></button>
    }

  </div>)
}
NestedResourceActionButtons.propTypes = {
  resourceKey: PropTypes.string,
  value: PropTypes.object.isRequired,
  addSiblingValueSubject: PropTypes.func,
  removeValue: PropTypes.func,
  setValueOrder: PropTypes.func,
  property: PropTypes.object,
  valueSubject: PropTypes.object,
  propertyTemplate: PropTypes.object,
  subjectTemplate: PropTypes.object,
  siblingValues: PropTypes.array,
  index: PropTypes.number,
}

const mapStateToProps = (state, ownProps) => {
  const property = selectNormProperty(state, ownProps.value?.propertyKey)
  const valueSubject = selectNormSubject(state, ownProps.value?.valueSubjectKey)
  const values = selectNormValues(state, property?.valueKeys) || []

  const siblingValues = values.filter((siblingValue) => {
    const siblingValueSubject = selectNormSubject(state, siblingValue.valueSubjectKey)
    return siblingValueSubject.subjectTemplateKey === valueSubject.subjectTemplateKey
  })

  return {
    property,
    valueSubject,
    siblingValues,
    propertyTemplate: selectPropertyTemplate(state, property?.propertyTemplateKey),
    subjectTemplate: selectSubjectTemplate(state, valueSubject?.subjectTemplateKey),
    resourceKey: selectCurrentResourceKey(state),
    index: values.indexOf(ownProps.value) + 1,
  }
}


const mapDispatchToProps = (dispatch) => bindActionCreators({ addSiblingValueSubject, removeValue, setValueOrder }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NestedResourceActionButtons)
