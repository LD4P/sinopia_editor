// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'
import PropertyLabelInfo from './PropertyLabelInfo'
import {
  findNode, isExpanded, getPropertyTemplate, findResourceValidationErrorsByPath, getDisplayResourceValidations,
} from 'selectors/resourceSelectors'
import { toggleCollapse, removeResource } from 'actions/index'
import { expandResource } from 'actionCreators/resources'
import _ from 'lodash'


const OutlineHeader = (props) => {
  const icon = props.collapsed === true ? faAngleRight : faAngleDown

  const isAdd = _.isEmpty(props.resourceModel)

  let error
  let groupClasses = 'rOutline-header'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }

  if (isAdd) {
    return (
      <div className={groupClasses}>
        <button type="button" className="btn btn-default btn-add" onClick={props.handleAddButton} data-id={props.id}>
          + Add <strong><PropertyLabel propertyTemplate={props.property} /></strong>
        </button>
        <PropertyLabelInfo propertyTemplate={ props.property } />
        { error && <span className="help-block help-block-error">{error}</span>}
      </div>
    )
  }

  return (
    <div className={groupClasses}>
      <button type="button" className="btn btn-sm btn-toggle" onClick={props.handleToggle} data-id={props.id} disabled={isAdd}>
        <FontAwesomeIcon icon={icon} />
      </button>
      <strong><PropertyLabel propertyTemplate={props.property} /></strong>
      <PropertyLabelInfo propertyTemplate={ props.property } />
      <button type="button" className="btn btn-sm btn-outline-primary btn-remove" onClick={props.handleRemoveButton} data-id={props.id}>
        Remove
      </button>

    </div>
  )
}

OutlineHeader.propTypes = {
  collapsed: PropTypes.any,
  handleCollapsed: PropTypes.func,
  id: PropTypes.string,
  property: PropTypes.object,
  reduxPath: PropTypes.array,
  errors: PropTypes.array,
  resourceModel: PropTypes.object,
  handleAddButton: PropTypes.func,
  handleRemoveButton: PropTypes.func,
  handleToggle: PropTypes.func,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, ownProps) => {
  const propertyURI = ownProps.reduxPath.slice(-1)[0]
  const resourceTemplateId = ownProps.reduxPath.slice(-2)[0]
  const property = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const resourceModel = findNode(state, ownProps.reduxPath)
  const errors = findResourceValidationErrorsByPath(state, ownProps.reduxPath)
  const displayValidations = getDisplayResourceValidations(state)
  return {
    resourceModel,
    property,
    collapsed: !isExpanded(state, ownProps.reduxPath),
    errors,
    displayValidations,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleToggle: (event) => {
    event.preventDefault()
    dispatch(toggleCollapse(ownProps.reduxPath))
  },
  handleAddButton: (event) => {
    event.preventDefault()
    dispatch(expandResource(ownProps.reduxPath))
  },
  handleRemoveButton: (event) => {
    event.preventDefault()
    dispatch(removeResource(ownProps.reduxPath))
    dispatch(toggleCollapse(ownProps.reduxPath))
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(OutlineHeader)
