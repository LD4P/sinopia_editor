// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'
import PropertyLabelInfo from './PropertyLabelInfo'
import { displayResourceValidations } from 'selectors/errors'
import { showProperty, hideProperty } from 'actions/resources'
import { resourceEditErrorKey } from '../Editor'
import { selectCurrentResourceIsReadOnly } from 'selectors/resources'
import _ from 'lodash'
import { expandProperty, contractProperty } from 'actionCreators/resources'
import { bindActionCreators } from 'redux'

const NestedPropertyHeader = (props) => {
  const toggleIcon = props.property.show === true ? faAngleDown : faAngleRight
  const toggleAria = props.property.show === true ? `Hide ${props.propertyTemplate.label}` : `Show ${props.propertyTemplate.label}`
  const trashIcon = faTrashAlt

  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))

  const isAdd = !readOnly && !props.property.valueKeys

  let error
  let groupClasses = 'rOutline-header'

  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    groupClasses += ' is-invalid'
    error = props.property.errors.join(',')
  }

  const toggleProperty = () => {
    if (props.property.show) {
      props.hideProperty(props.property.key)
    } else {
      props.showProperty(props.property.key)
    }
  }

  if (isAdd) {
    return (
      <div className={groupClasses}>
        <button type="button"
                className="btn btn-default btn-add btn-add-property"
                onClick={() => props.expandProperty(props.property.key, resourceEditErrorKey(props.resourceKey))}
                aria-label={`Add ${props.propertyTemplate.label}`}
                data-testid={`Add ${props.propertyTemplate.label}`}
                data-id={props.property.key}>
          + Add <strong><PropertyLabel propertyTemplate={props.propertyTemplate} /></strong>
        </button>
        <PropertyLabelInfo propertyTemplate={ props.propertyTemplate } />
        { error && <span className="invalid-feedback">{error}</span>}
      </div>
    )
  }

  return (
    <div className={groupClasses}>
      <button type="button"
              className="btn btn-sm btn-toggle"
              data-id={props.id}
              disabled={isAdd}
              aria-label={toggleAria}
              data-testid={toggleAria}
              onClick={() => toggleProperty()}>
        <FontAwesomeIcon className="toggle-icon" icon={toggleIcon} />
      </button>
      <strong><PropertyLabel propertyTemplate={props.propertyTemplate} /></strong>
      <PropertyLabelInfo propertyTemplate={ props.propertyTemplate } />
      <button type="button"
              className="btn btn-sm btn-remove pull-right"
              disabled={readOnly}
              onClick={() => props.contractProperty(props.property.key)}
              aria-label={`Remove ${props.propertyTemplate.label}`}
              data-testid={`Remove ${props.propertyTemplate.label}`}
              data-id={props.property.key}>
        <FontAwesomeIcon className="trash-icon" icon={trashIcon} />
      </button>
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
}

const mapStateToProps = (state, ownProps) => ({
  collapsed: false,
  displayValidations: displayResourceValidations(state, ownProps.property?.rootSubjectKey),
  resourceKey: ownProps.property?.rootSubjectKey,
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  expandProperty, contractProperty, showProperty, hideProperty,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NestedPropertyHeader)
