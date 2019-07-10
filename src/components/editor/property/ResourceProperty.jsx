// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { booleanPropertyFromTemplate } from 'Utilities'
import { findNode } from 'selectors/resourceSelectors'
import _ from 'lodash'

export class ResourceProperty extends Component {
  renderResourcePropertyJsx = () => {
    const jsx = []

    Object.keys(this.props.models).forEach((rtId) => {
      const resourceRows = this.props.models[rtId]
      resourceRows.forEach((resourceRow) => {
        const resourceTemplate = resourceRow.resourceTemplate

        if (resourceTemplate === undefined) {
          return jsx.push(
            <div className="alert alert-warning" key={rtId}>
              <strong>Warning:</strong> this property refers to a missing Resource Template. You cannot edit it until a Resource Template with an ID of <em>{ rtId }</em> has been <a href="/templates">imported</a> into the Sinopia Linked Data Editor.
            </div>,
          )
        }

        const propertyReduxPath = _.first(resourceRow.properties).reduxPath
        const resourceReduxPath = propertyReduxPath.slice(0, propertyReduxPath.length - 1)
        jsx.push(
          <div className="row" key={shortid.generate()}>
            <section className="col-sm-8">
              <h5>{resourceTemplate.resourceLabel}</h5>
            </section>
            <section className="col-sm-4">
              <PropertyActionButtons handleAddClick={e => this.props.handleAddClick(resourceReduxPath, e)}
                                     reduxPath={this.props.reduxPath}
                                     addButtonDisabled={this.props.addButtonDisabled} />
            </section>
          </div>,
        )

        resourceRow.properties.forEach((model) => {
          jsx.push(
            <PropertyTemplateOutline key={shortid.generate()}
                                     propertyTemplate={model.property}
                                     reduxPath={model.reduxPath}
                                     addButtonDisabled={model.isAddDisabled}
                                     resourceTemplate={resourceTemplate} />,
          )
        })
      })
    })

    return jsx
  }

  render() {
    return (
      <div>
        { this.renderResourcePropertyJsx() }
      </div>
    )
  }
}

ResourceProperty.propTypes = {
  addButtonDisabled: PropTypes.bool,
  handleAddClick: PropTypes.func,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  models: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const models = {}

  const propertyNode = findNode(state.selectorReducer, ourProps.reduxPath)
  Object.keys(propertyNode).forEach((key) => {
    const resourceTemplateId = Object.keys(propertyNode[key])[0]
    const resourceTemplate = state.selectorReducer.entities.resourceTemplates[resourceTemplateId]
    if (!resourceTemplate) {
      return
    }
    // Add empty array if necessary
    if (models[resourceTemplateId] === undefined) {
      models[resourceTemplateId] = []
    }
    const model = { resourceTemplate, properties: [] }
    models[resourceTemplateId].push(model)
    resourceTemplate.propertyTemplates.map((rtProperty) => {
      const propertyReduxPath = [...ourProps.reduxPath, key, resourceTemplateId, rtProperty.propertyURI]

      const isAddDisabled = !booleanPropertyFromTemplate(rtProperty, 'repeatable', false)
      model.properties.push({
        isAddDisabled,
        reduxPath: propertyReduxPath,
        property: rtProperty,
      })
    })
  })
  return { models }
}

export default connect(mapStateToProps, null)(ResourceProperty)
