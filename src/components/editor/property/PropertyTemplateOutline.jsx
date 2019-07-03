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
import { refreshResourceTemplate, resourceTemplateLoaded } from 'actions/index'

import {
  findNode,
} from 'selectors/resourceSelectors'

// This draws children of either ResourceProperty or PropertyComponent
class PropertyTemplateOutline extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapsed: true,
      propertyTypeRow: [],
      nestedResourceTemplates: [],
    }
  }

  outlineRowClass = () => {
    let classNames = 'rOutline-property'

    if (this.state.collapsed) { classNames += ' collapse' }

    return classNames
  }

  handleAddClick = (event) => {
    event.preventDefault()
    this.addPropertyTypeRows()
  }

  fulfillRTPromises = async promiseAll => await promiseAll.then((rts) => {
    rts.map((fulfilledResourceTemplateRequest) => {
      const joinedRts = [...this.state.nestedResourceTemplates]

      joinedRts.push(fulfilledResourceTemplateRequest.response.body)
      // Add the resource template into the store
      store.dispatch(resourceTemplateLoaded(fulfilledResourceTemplateRequest.response.body))
      this.setState({ nestedResourceTemplates: joinedRts })
      const resourceTemplate = fulfilledResourceTemplateRequest.response.body

      resourceTemplate.propertyTemplates.forEach((propertyTemplate) => {
        const newReduxPath = [...this.props.reduxPath,
          this.props.propertyTemplate.propertyURI,
          shortid.generate(),
          resourceTemplate.id,
          propertyTemplate.propertyURI]
        this.props.initNewResourceTemplate({ reduxPath: newReduxPath, property: propertyTemplate })
      })
    })
  }).catch(() => {})


  loadResourceTemplates() {
    this.fulfillRTPromises(
      this.resourceTemplatePromises(this.props.propertyTemplate.valueConstraint.valueTemplateRefs),
    ).then(() => {
      this.addPropertyTypeRows()
    })
  }

  resourceTemplatePromises = templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId)))

  // When the plus button is clicked, load reference templates (property.valueConstraint.valueTemplateRefs)
  handleTogglePlusButton = (event) => {
    event.preventDefault()

    if (this.isCollapsed() && !this.hasAddedARow()) {
      this.addChildRow()
    }
    this.toggleCollapsed()
  }

  addChildRow() {
    if (isResourceWithValueTemplateRef(this.props.propertyTemplate)) {
      this.loadResourceTemplates()
    } else {
      this.addPropertyTypeRows()
    }
  }

  isCollapsed() {
    return this.state.collapsed
  }

  hasAddedARow() {
    return this.state.rowAdded
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  addPropertyTypeRows() {
    const property = this.props.propertyTemplate
    const newOutput = [...this.state.propertyTypeRow]
    newOutput.push(property)
    this.setState({ propertyTypeRow: newOutput, rowAdded: true })
  }

  renderPropertyRows = () => {
    if (this.state.collapsed) {
      return
    }
    const keys = Object.keys(this.props.models)
    return keys.map((key, index) => (
      <PropertyTypeRow
        key={shortid.generate()}
        handleAddClick={this.props.handleAddClick}
        reduxPath={this.props.reduxPath}
        addButtonDisabled={this.props.addButtonDisabled}
        propertyTemplate={this.props.propertyTemplate}>
        { this.renderOneProperty(this.props.propertyTemplate, index) }
      </PropertyTypeRow>
    ))
  }

  renderOneProperty = (property, index) => {
    if (isResourceWithValueTemplateRef(property)) {
      const isAddDisabled = !booleanPropertyFromTemplate(property, 'repeatable', false) || index > 0

      return (<ResourceProperty key={shortid.generate()}
                                propertyTemplate={property}
                                reduxPath={this.props.reduxPath}
                                nestedResourceTemplates={this.state.nestedResourceTemplates}
                                handleAddClick={this.handleAddClick}
                                addButtonDisabled={isAddDisabled} />)
    }
console.log("THIS IS A COMPONETN")
console.log(this.props.reduxPath)
    return (<PropertyComponent key={shortid.generate()} propertyTemplate={property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    return (
      <div className="rtOutline" data-label={this.props.propertyTemplate.propertyLabel}>
        <OutlineHeader pt={this.props.propertyTemplate}
                       id={resourceToName(this.props.propertyTemplate.propertyURI)}
                       collapsed={this.state.collapsed}
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
  initNewResourceTemplate: PropTypes.func,
  isRequired: PropTypes.func,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  rtId: PropTypes.string,
  models: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const models = findNode(state.selectorReducer, ourProps.reduxPath)[ourProps.propertyTemplate.propertyURI] || { sample: {} }
  return { models }
}

const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rtContext) {
    dispatch(refreshResourceTemplate(rtContext))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTemplateOutline)
