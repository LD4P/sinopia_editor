// Copyright 2019 Stanford University see LICENSE for license

import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrashAlt, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { resourceEditErrorKey } from '../Editor'
import { selectCurrentResourceKey, selectProperty } from 'selectors/resources'
import { addSiblingValueSubject } from 'actionCreators/resources'
import { removeValue, setValueOrder } from 'actions/resources'
import _ from 'lodash'

const NestedResourceActionButtons = (props) => {
  const subjectTemplateKey = props.value.valueSubject.subjectTemplateKey
  const siblingValues = useMemo(() => props.property.values
    .filter((value) => value.valueSubject.subjectTemplateKey === subjectTemplateKey),
  [props.property.values, subjectTemplateKey])
  // Show add button if repeatable and first value.
  const showAddButton = props.property.propertyTemplate.repeatable && props.value.key === _.first(siblingValues).key
  // Show delete button if more than one.
  const showRemoveButton = siblingValues.length > 1
  const showMoveUpButton = props.value.property.propertyTemplate.ordered && props.value.index > 1
  const showMoveDownButton = props.value.property.propertyTemplate.ordered && props.value.index < props.property.values.length

  const addAnother = (event) => {
    event.preventDefault()
    return props.addSiblingValueSubject(_.last(siblingValues).key, resourceEditErrorKey(props.resourceKey))
  }

  const moveUp = (event) => {
    props.setValueOrder(props.value.key, props.value.index - 1)
    event.preventDefault()
  }

  const moveDown = (event) => {
    props.setValueOrder(props.value.key, props.value.index + 1)
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
          aria-label={`Add another ${props.value.valueSubject.subjectTemplate.label}`}
          data-testid={`Add another ${props.value.valueSubject.subjectTemplate.label}`}
          onClick={addAnother}>+ Add another</button>
    }
    { showRemoveButton
      && <button
        className="btn btn-sm btn-remove-another btn-nested-resource"
        aria-label={`Remove ${props.value.valueSubject.subjectTemplate.label}`}
        data-testid={`Remove ${props.value.valueSubject.subjectTemplate.label}`}
        onClick={removeValue}><FontAwesomeIcon icon={faTrashAlt} /></button>
    }
    { showMoveUpButton
      && <button
          className="btn btn-sm btn-nested-resource btn-moveup"
          aria-label={`Move up ${props.value.valueSubject.subjectTemplate.label}`}
          data-testid={`Move up ${props.value.valueSubject.subjectTemplate.label}`}
          onClick={moveUp}><FontAwesomeIcon icon={faArrowUp} /></button>
    }
    { showMoveDownButton
      && <button
          className="btn btn-sm btn-nested-resource btn-movedown"
          aria-label={`Move down ${props.value.valueSubject.subjectTemplate.label}`}
          data-testid={`Move down ${props.value.valueSubject.subjectTemplate.label}`}
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
}

const mapStateToProps = (state, ownProps) => ({
  // Separately getting property because going to need to evaluate sibling values.
  property: selectProperty(state, ownProps.value.propertyKey),
  resourceKey: selectCurrentResourceKey(state),
})


const mapDispatchToProps = (dispatch) => bindActionCreators({ addSiblingValueSubject, removeValue, setValueOrder }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NestedResourceActionButtons)
