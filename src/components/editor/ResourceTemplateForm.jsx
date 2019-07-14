// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import PropertyPanel from './property/PropertyPanel'
import PropertyResourceTemplate from './property/PropertyResourceTemplate'
import PropertyComponent from './property/PropertyComponent'
import { removeAllContent, setItems } from 'actions/index'
import { isResourceWithValueTemplateRef } from 'Utilities'
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

      keys.forEach((key) => {
        const resourceTemplateId = _.first(Object.keys(resourceProperty[key]))
        const newReduxPath = [...this.props.reduxPath, property.propertyURI, key, resourceTemplateId]

        rtProperties.push(<PropertyResourceTemplate
          key={shortid.generate()}
          isRepeatable={property.repeatable}
          reduxPath={newReduxPath} />)
      })
      if ((rtIds.length - i) > 1) {
        rtProperties.push(<hr key={i} />)
      }
    })

    return rtProperties
  }

  defaultValues = () => {
    this.props.propertyTemplates.map((pt) => {
      if (pt.mandatory === undefined) pt.mandatory = 'true'
      if (pt.repeatable === undefined) pt.repeatable = 'false'
      if (pt.editable === undefined) pt.editable = 'true'
    })
  }

  renderComponentForm = () => (
    <div>
      <form>
        <div className="ResourceTemplateForm row">
          {
            this.props.propertyTemplates.map((pt, index) => {
              if (isResourceWithValueTemplateRef(pt)) {
                if (!_.isEmpty(this.props.resourceProperties)) {
                  return (
                    <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.resourceTemplateId}>
                      {this.resourceTemplateFields(pt.valueConstraint.valueTemplateRefs, pt)}
                    </PropertyPanel>
                  )
                }
              }

              const newReduxPath = [...this.props.reduxPath, pt.propertyURI]
              return (
                <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.resourceTemplateId}>
                  <PropertyComponent index={index}
                                     reduxPath={newReduxPath}
                                     propertyTemplate={pt} />

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
  resourceTemplateId: PropTypes.string.isRequired,
  handleMyItemsChange: PropTypes.func,
  handleRemoveAllContent: PropTypes.func,
  propertyTemplates: PropTypes.array,
  resourceProperties: PropTypes.object,
  reduxPath: PropTypes.array,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const resourceTemplateId = reduxPath.pop()
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const resourceProperties = findNode(state.selectorReducer, ourProps.reduxPath)
  return {
    resourceTemplateId,
    propertyTemplates: resourceTemplate?.propertyTemplates || [],
    resourceProperties,
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(setItems(userInput))
  },
  handleRemoveAllContent(id) {
    dispatch(removeAllContent(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
