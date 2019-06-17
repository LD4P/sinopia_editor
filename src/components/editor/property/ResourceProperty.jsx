// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { refreshResourceTemplate } from 'actions/index'
import { booleanPropertyFromTemplate } from 'Utilities'

const _ = require('lodash')

export class ResourceProperty extends Component {
  constructor(props) {
    super(props)
  }

  renderResourcePropertyJsx = () => {
    const jsx = []

    this.props.propertyTemplate.valueConstraint.valueTemplateRefs.map((rtId) => {
      const resourceTemplate = _.find(this.props.nestedResourceTemplates, ['id', rtId])
      const resourceKeyId = shortid.generate()
      const newReduxPath = Object.assign([], this.props.reduxPath)

      newReduxPath.push(this.props.propertyTemplate.propertyURI)

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
        const keyId = shortid.generate()
        const propertyReduxPath = Object.assign([], newReduxPath)

        propertyReduxPath.push(rtProperty.propertyURI)
        const payload = { reduxPath: propertyReduxPath, property: rtProperty }

        this.props.initNewResourceTemplate(payload)
        const isAddDisabled = !booleanPropertyFromTemplate(rtProperty, 'repeatable', false)

        jsx.push(
          <PropertyTemplateOutline key={keyId}
                                   propertyTemplate={rtProperty}
                                   reduxPath={propertyReduxPath}
                                   addButtonDisabled={isAddDisabled}
                                   initNewResourceTemplate={this.props.initNewResourceTemplate}
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
  initNewResourceTemplate: PropTypes.func,
  nestedResourceTemplates: PropTypes.array,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
}
const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rtContext) {
    dispatch(refreshResourceTemplate(rtContext))
  },
})

export default connect(null, mapDispatchToProps)(ResourceProperty)
