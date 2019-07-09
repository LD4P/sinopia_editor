// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { refreshPropertyTemplate } from 'actions/index'
import { booleanPropertyFromTemplate } from 'Utilities'
import { findNode } from 'selectors/resourceSelectors'

const _ = require('lodash')

export class ResourceProperty extends Component {
  dispatchPayloads = [] // to separate needed state changes from rendering

  constructor(props) {
    super(props)
    this.dispatchPayloads = []
  }

  // NOTE:  if this component is ever re-rendered, we will need to ensure we get *changed* payloads to redux
  //   as of 2019-06-18, the code base never re-renders this component, AFAICT.  We load the resource template up once.
  componentDidMount() {
    this.dispatchPayloads.forEach((payload) => { this.props.initNewResourceTemplate(payload) })
  }

  renderResourcePropertyJsx = () => {
    const jsx = []

    Object.keys(this.props.models).forEach((rtId) => {
      const resourceRow = this.props.models[rtId]
      const resourceTemplate = resourceRow.resourceTemplate

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
                                   addButtonDisabled={this.props.addButtonDisabled} />
          </section>
        </div>,
      )

      resourceRow.properties.forEach((model) => {
        const keyId = shortid.generate()
        const payload = { reduxPath: model.reduxPath, property: model.property }
        this.dispatchPayloads.push(payload)

        jsx.push(
          <PropertyTemplateOutline key={keyId}
                                   propertyTemplate={model.property}
                                   reduxPath={model.reduxPath}
                                   addButtonDisabled={model.isAddDisabled}
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
  models: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const models = {}

  ourProps.propertyTemplate.valueConstraint.valueTemplateRefs.forEach((rtId) => {
    const resourceTemplate = _.find(ourProps.nestedResourceTemplates, ['id', rtId])
    models[rtId] = { resourceTemplate, properties: [] }
    const newReduxPath = Object.assign([], ourProps.reduxPath)

    newReduxPath.push(ourProps.propertyTemplate.propertyURI)

    const formData = findNode(state.selectorReducer, newReduxPath)
    // TODO: foreach ?
    const resourceKeyId = Object.keys(formData)[0] || shortid.generate()
    newReduxPath.push(resourceKeyId)
    newReduxPath.push(rtId)

    resourceTemplate.propertyTemplates.map((rtProperty) => {
      const propertyReduxPath = Object.assign([], newReduxPath)
      propertyReduxPath.push(rtProperty.propertyURI)

      const isAddDisabled = !booleanPropertyFromTemplate(rtProperty, 'repeatable', false)

      models[rtId].properties.push({
        isAddDisabled,
        reduxPath: propertyReduxPath,
        property: rtProperty,
      })
    })
  })

  return { models }
}

const mapDispatchToProps = dispatch => ({
  initNewResourceTemplate(rtContext) {
    dispatch(refreshPropertyTemplate(rtContext))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceProperty)
