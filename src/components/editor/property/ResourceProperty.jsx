// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { booleanPropertyFromTemplate } from 'Utilities'

const _ = require('lodash')

export class ResourceProperty extends Component {
  renderResourcePropertyJsx = () => {
    const jsx = []

    this.props.propertyTemplate.valueConstraint.valueTemplateRefs.map((rtId) => {
      const resourceTemplate = _.find(this.props.nestedResourceTemplates, ['id', rtId])
      const resourceKeyId = shortid.generate()
      const newReduxPath = Object.assign([], this.props.reduxPath)

      newReduxPath.push(this.props.propertyTemplate.propertyURI)

      // TODO get the childeren here.


      newReduxPath.push(resourceKeyId)
      newReduxPath.push(rtId)

      if (resourceTemplate === undefined) {
        return jsx.push(
          <div className="alert alert-warning" key={rtId}>
            <strong>Warning:</strong> this property refers to a missing Resource Template. You cannot edit it until a Resource Template with an ID of <em>{ rtId }</em> has been <a href="/templates">imported</a> into the Sinopia Linked Data Editor.
          </div>,
        )
      }

      jsx.push(
        <div className="row" key={shortid.generate()}>
          <section className="col-sm-8">
            <h5>{resourceTemplate.resourceLabel}</h5>
          </section>
          <section className="col-sm-4">
            <PropertyActionButtons handleAddClick={this.props.handleAddClick}
                                   reduxPath={this.props.reduxPath}
                                   addButtonDisabled={this.props.addButtonDisabled}
                                   key={resourceKeyId} />
          </section>
        </div>,
      )
      resourceTemplate.propertyTemplates.map((rtProperty) => {
        const propertyReduxPath = Object.assign([], newReduxPath)
        propertyReduxPath.push(rtProperty.propertyURI)

        const isAddDisabled = !booleanPropertyFromTemplate(rtProperty, 'repeatable', false)
        console.log("Populating with stuff")

        jsx.push(
          <PropertyTemplateOutline key={shortid.generate()}
                                   propertyTemplate={rtProperty}
                                   reduxPath={propertyReduxPath}
                                   addButtonDisabled={isAddDisabled}
                                   resourceTemplate={resourceTemplate} />,
        )
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
  nestedResourceTemplates: PropTypes.array,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
}

export default connect(null, null)(ResourceProperty)
