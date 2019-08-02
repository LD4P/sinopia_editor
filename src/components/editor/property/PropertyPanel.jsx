// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PropertyLabel from './PropertyLabel'
import PropertyLabelInfo from './PropertyLabelInfo'
import { bindActionCreators } from 'redux'
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
        <PropertyLabel propertyTemplate={ props.propertyTemplate } />
        <PropertyLabelInfo propertyTemplate={ props.propertyTemplate } />{nbsp}
        { isAdd && (
          <button type="button" className="btn btn-sm btn-primary btn-add" onClick={() => props.expandResource(props.reduxPath)} data-id={props.id}>
            + Add
          </button>
        )}
        { !isAdd && !isMandatory && (
          <button type="button" className="btn btn-sm btn-primary btn-remove" onClick={() => props.removeResource(props.reduxPath)} data-id={props.id}>
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
  expandResource: PropTypes.func,
  removeResource: PropTypes.func,
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

const mapDispatchToProps = dispatch => bindActionCreators({ expandResource, removeResource }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PropertyPanel)
