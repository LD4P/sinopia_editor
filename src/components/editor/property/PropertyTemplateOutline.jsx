// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import { booleanPropertyFromTemplate, isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'
import { findNode, isExpanded, getPropertyTemplate } from 'selectors/resourceSelectors'
import { toggleCollapse } from 'actions/index'
import { expandResource } from 'actionCreators/resources'
import _ from 'lodash'

class PropertyTemplateOutline extends Component {
  outlineRowClass = () => {
    let classNames = 'rOutline-property'

    if (this.props.collapsed) { classNames += ' collapse' }

    return classNames
  }

  renderPropertyRows = () => {
    if (this.props.collapsed) {
      return
    }

    if (isResourceWithValueTemplateRef(this.props.property)) {
      const isAddDisabled = !booleanPropertyFromTemplate(this.props.property, 'repeatable', false)
      return (<ResourceProperty key={shortid.generate()}
                                propertyTemplate={this.props.property}
                                reduxPath={this.props.reduxPath}
                                addButtonDisabled={isAddDisabled} />)
    }

    return (<PropertyComponent key={shortid.generate()} propertyTemplate={this.props.property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    return (
      <div className="rtOutline" data-label={this.props.property.propertyLabel}>
        <OutlineHeader pt={this.props.property}
                       id={resourceToName(this.props.property.propertyURI)}
                       collapsed={this.props.collapsed}
                       key={shortid.generate()}
                       handleCollapsed={this.props.handleTogglePlusButton}
                       isAdd={_.isEmpty(this.props.resourceModel)} />
        <div className={this.outlineRowClass()}>
          {this.renderPropertyRows()}
        </div>
      </div>
    )
  }
}

PropertyTemplateOutline.propTypes = {
  reduxPath: PropTypes.array,
  property: PropTypes.object.isRequired,
  resourceModel: PropTypes.object,
  collapsed: PropTypes.bool,
  handleTogglePlusButton: PropTypes.func,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const propertyURI = reduxPath.pop()
  const resourceTemplateId = reduxPath.pop()
  const property = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const resourceModel = findNode(state.selectorReducer, ourProps.reduxPath)

  return {
    resourceModel,
    property,
    collapsed: !isExpanded(state.selectorReducer, ourProps.reduxPath),
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleTogglePlusButton: (event) => {
    event.preventDefault()
    if (_.isEmpty(ownProps.resourceModel)) {
      // Load reference templates (property.valueConstraint.valueTemplateRefs)
      dispatch(expandResource(ownProps.reduxPath))
    }
    dispatch(toggleCollapse(ownProps.reduxPath))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTemplateOutline)
