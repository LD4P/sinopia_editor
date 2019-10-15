// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { findNode } from 'selectors/resourceSelectors'
import { findResourceTemplate } from 'selectors/entitySelectors'
import _ from 'lodash'

export class ResourceProperty extends Component {
  renderResourcePropertyJsx = () => {
    const jsx = []

    Object.keys(this.props.models).forEach((rtId) => {
      const resourceRows = this.props.models[rtId]
      resourceRows.forEach((resourceRow, index) => {
        const resourceTemplate = resourceRow.resourceTemplate

        if (resourceTemplate === undefined) {
          return jsx.push(
            <div className="alert alert-warning" key={rtId}>
              <strong>Warning:</strong> this property refers to a missing Resource Template. You cannot edit it until a Resource Template with an ID of <em>{ rtId }</em> has been <a href="/templates">imported</a> into the Sinopia Linked Data Editor.
            </div>,
          )
        }

        const propertyReduxPath = _.first(resourceRow.properties)
        const resourceReduxPath = propertyReduxPath.slice(0, propertyReduxPath.length - 1)
        const isAddHidden = this.props.addButtonHidden || index > 0
        const isRemoveHidden = resourceRows.length === 1
        jsx.push(
          <div className="row" key={resourceReduxPath.join()}>
            <section className="col-sm-6">
              <h5>{resourceTemplate.resourceLabel}</h5>
            </section>
            <section className="col-sm-6">
              <PropertyActionButtons reduxPath={resourceReduxPath}
                                     addButtonHidden={isAddHidden}
                                     removeButtonHidden={isRemoveHidden} />
            </section>
          </div>,
        )

        resourceRow.properties.forEach((reduxPath) => {
          jsx.push(
            <PropertyTemplateOutline key={reduxPath.join()} reduxPath={reduxPath} />,
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
  addButtonHidden: PropTypes.bool,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  models: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const models = {}

  const propertyNode = findNode(state, ourProps.reduxPath)
  Object.keys(propertyNode).forEach((key) => {
    const resourceTemplateId = Object.keys(propertyNode[key])[0]
    const resourceTemplate = findResourceTemplate(state, resourceTemplateId)
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
      model.properties.push(propertyReduxPath)
    })
  })
  return { models }
}

export default connect(mapStateToProps, null)(ResourceProperty)
