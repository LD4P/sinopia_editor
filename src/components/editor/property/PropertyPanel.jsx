// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabel from './PropertyLabel'
import { connect } from 'react-redux'
import { findNode, getPropertyTemplate } from 'selectors/resourceSelectors'
import { removeResource } from 'actions/index'
import { expandResource } from 'actionCreators/resources'
import _ from 'lodash'

const PropertyPanel = (props) => {
  const isAdd = _.isEmpty(props.resourceModel)
  const isMandatory = props.propertyTemplate.mandatory === 'true'
  const nbsp = '\u00A0'

  return (
    <div className="panel panel-property" data-label={ props.propertyTemplate.propertyLabel }>
      <div className="panel-heading prop-heading">
        <PropertyLabel propertyTemplate={ props.propertyTemplate } />{nbsp}
        { isAdd && (
          <button type="button" className="btn btn-sm btn-primary btn-add" onClick={props.handleAddButton} data-id={props.id}>
            + Add
          </button>
        )}
        { !isAdd && !isMandatory && (
          <button type="button" className="btn btn-sm btn-primary btn-remove" onClick={props.handleRemoveButton} data-id={props.id}>
            Remove
          </button>
        )}
      </div>
      { !isAdd
        && <div className="panel-body">
          { props.children }
        </div>
      }
    </div>
  )
}

PropertyPanel.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  float: PropTypes.number,
  reduxPath: PropTypes.array.isRequired,
  resourceModel: PropTypes.object,
  propertyTemplate: PropTypes.object,
  id: PropTypes.string,
  handleAddButton: PropTypes.func,
  handleRemoveButton: PropTypes.func,
}

const mapStateToProps = (state, ourProps) => {
  const propertyURI = ourProps.reduxPath.slice(-1)[0]
  const resourceTemplateId = ourProps.reduxPath.slice(-2)[0]
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const resourceModel = findNode(state.selectorReducer, ourProps.reduxPath)

  return {
    resourceModel,
    propertyTemplate,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleAddButton: (event) => {
    event.preventDefault()
    dispatch(expandResource(ownProps.reduxPath))
  },
  handleRemoveButton: (event) => {
    event.preventDefault()
    dispatch(removeResource(ownProps.reduxPath))
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPanel)
