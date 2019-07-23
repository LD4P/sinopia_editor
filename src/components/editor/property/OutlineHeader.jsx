// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'
import PropertyLabel from './PropertyLabel'
import {
  findNode, isExpanded, getPropertyTemplate, findErrors, getDisplayValidations,
} from 'selectors/resourceSelectors'
import { toggleCollapse, removeResource } from 'actions/index'
import { expandResource } from 'actionCreators/resources'
import _ from 'lodash'


const OutlineHeader = (props) => {
  const icon = props.collapsed === true ? faPlusSquare : faMinusSquare

  const isAdd = _.isEmpty(props.resourceModel)

  let error
  let groupClasses = 'rOutline-header'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }

  return (
    <div className={groupClasses}>
      <button type="button" className="btn btn-sm btn-outline-primary btn-toggle" onClick={props.handleAddAndOpen} data-id={props.id} disabled={isAdd}>
        <FontAwesomeIcon icon={icon} />
      </button>
      <PropertyLabel propertyTemplate={props.property} />
      { isAdd && (
        <button type="button" className="btn btn-sm btn-outline-primary btn-add" onClick={props.handleAddAndOpen} data-id={props.id}>
          Add
        </button>
      )}
      { isAdd && error && <span className="help-block">{error}</span>}

      { !isAdd && (
        <button type="button" className="btn btn-sm btn-outline-primary btn-remove" onClick={props.handleRemoveButton} data-id={props.id}>
          Remove
        </button>
      )}

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
  handleAddAndOpen: PropTypes.func,
  handleRemoveButton: PropTypes.func,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, ourProps) => {
  const propertyURI = ourProps.reduxPath.slice(-1)[0]
  const resourceTemplateId = ourProps.reduxPath.slice(-2)[0]
  const property = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const resourceModel = findNode(state.selectorReducer, ourProps.reduxPath)
  const errors = findErrors(state.selectorReducer, ourProps.reduxPath)
  const displayValidations = getDisplayValidations(state)

  return {
    resourceModel,
    property,
    collapsed: !isExpanded(state.selectorReducer, ourProps.reduxPath),
    errors,
    displayValidations,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleAddAndOpen: (event) => {
    event.preventDefault()
    if (_.isEmpty(ownProps.resourceModel)) {
      // Load reference templates (property.valueConstraint.valueTemplateRefs)
      dispatch(expandResource(ownProps.reduxPath))
    }
    dispatch(toggleCollapse(ownProps.reduxPath))
  },
  handleRemoveButton: (event) => {
    event.preventDefault()
    dispatch(removeResource(ownProps.reduxPath))
    dispatch(toggleCollapse(ownProps.reduxPath))
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(OutlineHeader)
