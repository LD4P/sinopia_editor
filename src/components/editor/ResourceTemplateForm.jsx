// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import PropertyPanel from './property/PropertyPanel'
import PropertyResourceTemplate from './property/PropertyResourceTemplate'
import PropertyComponent from './property/PropertyComponent'
import { isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import { getResourceTemplate, findNode } from 'selectors/resourceSelectors'
import _ from 'lodash'

// Renders the input form for the root ResourceTemplate
export class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
  }

  resourceTemplateFields = (rtIds, property) => {
    const rtProperties = []
    if (rtIds === null || rtIds === undefined) {
      return rtProperties
    }
    rtIds.map((rtId, i) => {
      const resourceProperty = this.props.resourceProperties[property.propertyURI]
      if (!resourceProperty) {
        return
      }
      const keys = Object.keys(resourceProperty).filter(key => _.first(Object.keys(resourceProperty[key])) === rtId)
      if (_.isEmpty(keys)) {
        return
      }

      keys.forEach((key, index) => {
        const resourceTemplateId = _.first(Object.keys(resourceProperty[key]))
        const newReduxPath = [...this.props.reduxPath, property.propertyURI, key, resourceTemplateId]

        rtProperties.push(<PropertyResourceTemplate
          key={newReduxPath.join()}
          isRepeatable={property.repeatable}
          reduxPath={newReduxPath}
          index={index} />)
      })
      if ((rtIds.length - i) > 1) {
        rtProperties.push(<hr key={i} />)
      }
    })

    return rtProperties
  }

  defaultValues = () => {
    this.props.propertyTemplates.map((propertyTemplate) => {
      if (propertyTemplate.mandatory === undefined) propertyTemplate.mandatory = 'true'
      if (propertyTemplate.repeatable === undefined) propertyTemplate.repeatable = 'false'
      if (propertyTemplate.editable === undefined) propertyTemplate.editable = 'true'
    })
  }

  cardRow = () => {

  }

  renderComponentForm = () => (
    <div>
      <form onSubmit={e => e.preventDefault()}>
        <div className="ResourceTemplateForm row">
          {
            this.props.propertyTemplates.map((propertyTemplate, index) => {
              const newReduxPath = [...this.props.reduxPath, propertyTemplate.propertyURI]
              const id = resourceToName(propertyTemplate.propertyURI)
              if (_.isEmpty(this.props.resourceProperties[propertyTemplate.propertyURI])) {
                return (
                  <PropertyPanel reduxPath={newReduxPath} key={index} float={index} id={id}>
                  </PropertyPanel>

                )
              }

              if (isResourceWithValueTemplateRef(propertyTemplate)) {
                if (!_.isEmpty(this.props.resourceProperties)) {
                  return (
                    <PropertyPanel reduxPath={newReduxPath} key={index} float={index} id={id}>
                      {this.resourceTemplateFields(propertyTemplate.valueConstraint.valueTemplateRefs, propertyTemplate)}
                    </PropertyPanel>
                  )
                }
              }

              return (
                <PropertyPanel reduxPath={newReduxPath} key={index} float={index} id={id}>
                  <PropertyComponent reduxPath={newReduxPath} propertyTemplate={propertyTemplate} />
                </PropertyPanel>
              )
            })
          }
        </div>
      </form>
    </div>
  )

  render() {
    if (!this.props.resourceProperties) {
      return null
    }
    return this.renderComponentForm()
  }
}

ResourceTemplateForm.propTypes = {
  propertyTemplates: PropTypes.array,
  resourceProperties: PropTypes.object,
  reduxPath: PropTypes.array,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const resourceTemplateId = reduxPath.pop()
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceProperties = findNode(state, ourProps.reduxPath)
  return {
    propertyTemplates: resourceTemplate?.propertyTemplates || [],
    resourceProperties,
  }
}

export default connect(mapStateToProps, null)(ResourceTemplateForm)
