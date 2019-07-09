// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import { getResourceTemplate } from 'sinopiaServer'
import { booleanPropertyFromTemplate, isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'
import store from 'store'
import { resourceTemplateLoaded } from 'actions/index'
import { findNode, getPropertyTemplate } from 'selectors/resourceSelectors'
import { expandResource as expandResourceAction} from 'actionCreators'
const _ = require('lodash')

class PropertyTemplateOutline extends Component {

  outlineRowClass = () => {
    let classNames = 'rOutline-property'

    if (this.props.collapsed) { classNames += ' collapse' }

    return classNames
  }

  handleAddClick = (event) => {
    event.preventDefault()
    this.addPropertyTypeRows()
  }

  // When the plus button is clicked, load reference templates (property.valueConstraint.valueTemplateRefs)
  handleTogglePlusButton = (event) => {
    console.log('handleTogglePlusButton', this.props.reduxPath, this.isCollapsed(), this.hasBeenExpanded())
    event.preventDefault()

    if (!this.hasBeenExpanded()) {
      console.log('expanding')
      this.props.expandResource(this.props.reduxPath)
    }
    // Will need to handle some other way
    // this.setState({ collapsed: !this.state.collapsed })
  }

  hasBeenExpanded() {
    return ! _.isEmpty(this.props.resourceModel)
  }

  addChildRow() {
    if (isResourceWithValueTemplateRef(this.props.propertyTemplate)) {
      this.loadResourceTemplates()
    } else {
      this.addPropertyTypeRows()
    }
  }

  loadResourceTemplates() {
    this.fulfillRTPromises(
      this.resourceTemplatePromises(this.props.propertyTemplate.valueConstraint.valueTemplateRefs),
    ).then(() => this.addPropertyTypeRows())
  }

  isCollapsed() {
    return this.props.collapsed
  }

  hasAddedARow() {
    return this.state.rowAdded
  }

  renderPropertyRows = () => {
    if (this.props.collapsed) {
      return
    }

    if (isResourceWithValueTemplateRef(this.props.property)) {
      // const isAddDisabled = !booleanPropertyFromTemplate(this.props.property, 'repeatable', false) || index > 0
      const isAddDisabled = false
      return (<ResourceProperty key={shortid.generate()}
                                propertyTemplate={this.props.property}
                                reduxPath={this.props.reduxPath}
                                handleAddClick={this.handleAddClick}
                                addButtonDisabled={isAddDisabled} />)
    }

    return (<PropertyComponent key={shortid.generate()} propertyTemplate={this.props.property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    return (
      <div className="rtOutline" data-label={this.props.propertyTemplate.propertyLabel}>
        <OutlineHeader pt={this.props.propertyTemplate}
                       id={resourceToName(this.props.propertyTemplate.propertyURI)}
                       collapsed={this.props.collapsed}
                       key={shortid.generate()}
                       handleCollapsed={this.handleTogglePlusButton} />
        <div className={this.outlineRowClass()}>
          {this.renderPropertyRows()}
        </div>
      </div>
    )
  }
}

PropertyTemplateOutline.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
  handleCollapsed: PropTypes.func,
  isRequired: PropTypes.func,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  collapsed: PropTypes.bool,
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
    collapsed: false,
  }
}

const mapDispatchToProps = dispatch => ({
  expandResource: (reduxPath) => {
    dispatch(expandResourceAction(reduxPath))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTemplateOutline)
