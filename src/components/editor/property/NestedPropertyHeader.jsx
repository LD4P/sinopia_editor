// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import { connect } from "react-redux"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"
import PropertyLabel from "./PropertyLabel"
import PropertyLabelInfo from "./PropertyLabelInfo"
import { displayResourceValidations } from "selectors/errors"
import { showProperty, hideProperty } from "actions/resources"
import _ from "lodash"
import { expandProperty, contractProperty } from "actionCreators/resources"
import { bindActionCreators } from "redux"
import ToggleButton from "../ToggleButton"
import useAlerts from "hooks/useAlerts"

const NestedPropertyHeader = (props) => {
  const errorKey = useAlerts()
  const toggleLabel =
    props.property.show === true
      ? `Hide ${props.propertyTemplate.label}`
      : `Show ${props.propertyTemplate.label}`
  const trashIcon = faTrashAlt

  const isAdd = !props.readOnly && !props.property.valueKeys

  let error
  let groupClasses = "rOutline-header"

  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    groupClasses += " is-invalid"
    error = props.property.errors.join(",")
  }

  const toggleProperty = (event) => {
    event.preventDefault()
    if (props.property.show) {
      props.hideProperty(props.property.key)
    } else {
      props.showProperty(props.property.key)
    }
  }

  if (isAdd) {
    return (
      <div className={groupClasses}>
        <button
          type="button"
          className="btn btn-add btn-add-property"
          onClick={() => props.expandProperty(props.property.key, errorKey)}
          aria-label={`Add ${props.propertyTemplate.label}`}
          data-testid={`Add ${props.propertyTemplate.label}`}
          data-id={props.property.key}
        >
          + Add{" "}
          <strong>
            <PropertyLabel
              required={props.propertyTemplate.required}
              label={props.propertyTemplate.label}
            />
          </strong>
        </button>
        <PropertyLabelInfo propertyTemplate={props.propertyTemplate} />
        {error && <span className="invalid-feedback">{error}</span>}
      </div>
    )
  }

  return (
    <div className={groupClasses}>
      <ToggleButton
        handleClick={toggleProperty}
        isExpanded={props.property.show}
        isDisabled={isAdd}
        label={toggleLabel}
      />
      <strong>
        <PropertyLabel
          required={props.propertyTemplate.required}
          label={props.propertyTemplate.label}
        />
      </strong>
      <PropertyLabelInfo propertyTemplate={props.propertyTemplate} />
      {!props.readOnly && (
        <button
          type="button"
          className="btn btn-sm btn-remove pull-right"
          onClick={() => props.contractProperty(props.property.key)}
          aria-label={`Remove ${props.propertyTemplate.label}`}
          data-testid={`Remove ${props.propertyTemplate.label}`}
          data-id={props.property.key}
        >
          <FontAwesomeIcon className="trash-icon" icon={trashIcon} />
        </button>
      )}
    </div>
  )
}

NestedPropertyHeader.propTypes = {
  collapsed: PropTypes.any,
  handleCollapsed: PropTypes.func,
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
  handleAddButton: PropTypes.func,
  handleRemoveButton: PropTypes.func,
  displayValidations: PropTypes.bool,
  expandProperty: PropTypes.func,
  contractProperty: PropTypes.func,
  showProperty: PropTypes.func,
  hideProperty: PropTypes.func,
  id: PropTypes.string,
  resourceKey: PropTypes.string,
  propertyLabelId: PropTypes.string,
  readOnly: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  collapsed: false,
  displayValidations: displayResourceValidations(
    state,
    ownProps.property?.rootSubjectKey
  ),
  resourceKey: ownProps.property?.rootSubjectKey,
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      expandProperty,
      contractProperty,
      showProperty,
      hideProperty,
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NestedPropertyHeader)
