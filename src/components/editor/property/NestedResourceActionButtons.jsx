// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { useSelector, useDispatch, shallowEqual } from "react-redux"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faTrashAlt,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons"
import { selectNormProperty, selectSiblingValues } from "selectors/resources"
import {
  selectSubjectTemplateForSubject,
  selectPropertyTemplate,
} from "selectors/templates"
import { addSiblingValueSubject } from "actionCreators/resources"
import {
  removeValue as removeValueAction,
  setValueOrder,
} from "actions/resources"
import useAlerts from "hooks/useAlerts"
import _ from "lodash"

const NestedResourceActionButtons = ({ value }) => {
  const dispatch = useDispatch()
  const errorKey = useAlerts()

  const property = useSelector((state) =>
    selectNormProperty(state, value.propertyKey)
  )
  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, property.propertyTemplateKey)
  )
  const siblingValues = useSelector(
    (state) => selectSiblingValues(state, value.key),
    shallowEqual
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplateForSubject(state, value.valueSubjectKey)
  )
  const index = property.valueKeys.indexOf(value.key) + 1

  // Show add button if repeatable and first value.
  const showAddButton =
    propertyTemplate.repeatable && value.key === _.first(siblingValues).key

  // Show delete button if more than one.
  const showRemoveButton = siblingValues.length > 1
  const showMoveUpButton = propertyTemplate.ordered && index > 1
  const showMoveDownButton =
    propertyTemplate.ordered && index < property.valueKeys.length

  const addAnother = (event) => {
    event.preventDefault()
    return dispatch(addSiblingValueSubject(_.last(siblingValues).key, errorKey))
  }

  const moveUp = (event) => {
    dispatch(setValueOrder(value.key, index - 1))
    event.preventDefault()
  }

  const moveDown = (event) => {
    dispatch(setValueOrder(value.key, index + 1))
    event.preventDefault()
  }

  const removeValue = (event) => {
    dispatch(removeValueAction(value.key))
    event.preventDefault()
  }

  return (
    <div className="btn-group pull-right" role="group">
      {showAddButton && (
        <button
          className="btn btn-sm btn-add-property"
          aria-label={`Add another ${subjectTemplate.label}`}
          data-testid={`Add another ${subjectTemplate.label}`}
          onClick={addAnother}
        >
          + Add another {subjectTemplate.label}
        </button>
      )}
      {showRemoveButton && (
        <button
          className="btn btn-sm btn-remove-another btn-nested-resource"
          aria-label={`Remove ${subjectTemplate.label}`}
          data-testid={`Remove ${subjectTemplate.label}`}
          onClick={removeValue}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      )}
      {showMoveUpButton && (
        <button
          className="btn btn-sm btn-nested-resource btn-moveup"
          aria-label={`Move up ${subjectTemplate.label}`}
          data-testid={`Move up ${subjectTemplate.label}`}
          onClick={moveUp}
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </button>
      )}
      {showMoveDownButton && (
        <button
          className="btn btn-sm btn-nested-resource btn-movedown"
          aria-label={`Move down ${subjectTemplate.label}`}
          data-testid={`Move down ${subjectTemplate.label}`}
          onClick={moveDown}
        >
          <FontAwesomeIcon icon={faArrowDown} />
        </button>
      )}
    </div>
  )
}
NestedResourceActionButtons.propTypes = {
  value: PropTypes.object.isRequired,
}

export default NestedResourceActionButtons
