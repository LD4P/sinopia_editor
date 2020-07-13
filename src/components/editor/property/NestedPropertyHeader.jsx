// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'
import PropertyLabelInfo from './PropertyLabelInfo'
import { displayResourceValidations } from 'selectors/errors'
import { showProperty, hideProperty } from 'actions/resources'
import { resourceEditErrorKey } from '../Editor'
import { selectProperty, selectCurrentResourceKey } from 'selectors/resources'
import _ from 'lodash'
import { expandProperty, contractProperty } from 'actionCreators/resources'
import { bindActionCreators } from 'redux'

const NestedPropertyHeader = (props) => {
  const toggleIcon = props.property.show === true ? faAngleDown : faAngleRight
  const toggleAria = props.property.show === true ? `Hide ${props.property.propertyTemplate.label}` : `Show ${props.property.propertyTemplate.label}`
  const trashIcon = faTrashAlt

  const isAdd = props.property.values === null

  let error
  let groupClasses = 'rOutline-header'

  if (props.displayValidations && !_.isEmpty(props.property.errors)) {
    groupClasses += ' has-error'
    error = props.property.errors.join(',')
  }

  const toggleProperty = () => {
    if (props.property.show) {
      props.hideProperty(props.propertyKey)
    } else {
      props.showProperty(props.propertyKey)
    }
  }

  if (isAdd) {
    return (
      <div className={groupClasses}>
        <button type="button"
                className="btn btn-default btn-add btn-add-property"
                onClick={() => props.expandProperty(props.propertyKey, resourceEditErrorKey(props.resourceKey))}
                aria-label={`Add ${props.property.propertyTemplate.label}`}
                data-id={props.propertyKey}>
          + Add <strong><PropertyLabel propertyTemplate={props.property.propertyTemplate} /></strong>
        </button>
        <PropertyLabelInfo propertyTemplate={ props.property.propertyTemplate } />
        { error && <span className="text-danger">{error}</span>}
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
              onClick={() => toggleProperty()}>
        <FontAwesomeIcon className="toggle-icon" icon={toggleIcon} />
      </button>
      <strong><PropertyLabel propertyTemplate={props.property.propertyTemplate} /></strong>
      <PropertyLabelInfo propertyTemplate={ props.property.propertyTemplate } />
      <button type="button"
              className="btn btn-sm btn-remove pull-right"
              onClick={() => props.contractProperty(props.propertyKey)}
              aria-label={`Remove ${props.property.propertyTemplate.label}`}
              data-id={props.propertyKey}>
        <FontAwesomeIcon className="trash-icon" icon={trashIcon} />
      </button>
    </div>
  )
}

NestedPropertyHeader.propTypes = {
  collapsed: PropTypes.any,
  handleCollapsed: PropTypes.func,
  property: PropTypes.object,
  handleAddButton: PropTypes.func,
  handleRemoveButton: PropTypes.func,
  displayValidations: PropTypes.bool,
  propertyKey: PropTypes.string,
  expandProperty: PropTypes.func,
  contractProperty: PropTypes.func,
  showProperty: PropTypes.func,
  hideProperty: PropTypes.func,
  id: PropTypes.string,
  resourceKey: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => ({
  property: selectProperty(state, ownProps.propertyKey),
  collapsed: false,
  displayValidations: displayResourceValidations(state),
  resourceKey: selectCurrentResourceKey(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  expandProperty, contractProperty, showProperty, hideProperty,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NestedPropertyHeader)
