// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import { getResourceTemplate } from '../../sinopiaServer'
import { isResourceWithValueTemplateRef, resourceToName, templateBoolean } from '../../Utilities'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'

export const addResourceTemplate = (resourceTemplate, reduxPath) => {
  const output = []
  // TODO: Add delete button, noted in issue #535

  output.push(<h5 key={shortid.generate()}>{resourceTemplate.resourceLabel}</h5>)
  resourceTemplate.propertyTemplates.map((rtProperty) => {
    const newReduxPath = [...reduxPath]
    const keyId = shortid.generate()

    newReduxPath.push(resourceTemplate.id, keyId)
    output.push(<PropertyTemplateOutline key={keyId}
                                         propertyTemplate={rtProperty}
                                         reduxPath={newReduxPath}
                                         resourceTemplate={resourceTemplate} />)
  })

  return output
}

export class PropertyTemplateOutline extends Component {
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

  // Uses currying to pass multiple parameters to handleAddClick
  handleAddClick = resourceTemplate => (event) => {
    event.preventDefault()
    const propertyTypeRows = [...this.state.propertyTypeRow]
    const output = addResourceTemplate(resourceTemplate, this.props.reduxPath)

    if (this.props.handleAddClick !== undefined) {
      this.props.handleAddClick(event)
    }
    this.setState({ propertyTypeRow: propertyTypeRows.concat(output) })
  }

  fulfillRTPromises = async promiseAll => await promiseAll.then((rts) => {
    rts.map((rt) => {
      const joinedRts = [...this.state.nestedResourceTemplates]

      joinedRts.push(rt.response.body)
      this.setState({ nestedResourceTemplates: joinedRts })
    })
  }).catch(() => {})

  resourceTemplatePromises = templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId)))

  handleClick = property => (event) => {
    event.preventDefault()

    this.setState({ collapsed: !this.state.collapsed })

    const templateRefList = isResourceWithValueTemplateRef(property) ? property.valueConstraint.valueTemplateRefs : []

    this.fulfillRTPromises(this.resourceTemplatePromises(templateRefList)).then(() => {
      this.addPropertyTypeRows(this.props.propertyTemplate)
    })
  }

  addPropertyTypeRows = (property) => {
    let existingJsx; let
      propertyJsx
    const newOutput = this.state.propertyTypeRow

    if (isResourceWithValueTemplateRef(property)) {
      const isAddDisabled = !templateBoolean(property.repeatable)

      propertyJsx = <ResourceProperty propertyTemplate={property}
                                      reduxPath={this.props.reduxPath}
                                      nestedResourceTemplates={this.state.nestedResourceTemplates}
                                      handleAddClick={this.handleAddClick}
                                      addButtonDisabled={isAddDisabled} />
    } else {
      propertyJsx = <PropertyComponent index={0} propertyTemplate={property} reduxPath={this.props.reduxPath} />
    }

    newOutput.forEach((propertyJsx) => {
      if (this.props.propertyTemplate.propertyURI === propertyJsx.props.propertyTemplate.propertyURI) {
        existingJsx = propertyJsx
      }
    })
    if (existingJsx === undefined) {
      newOutput.push(
        <PropertyTypeRow
          key={shortid.generate()}
          handleAddClick={this.props.handleAddClick}
          reduxPath={this.props.reduxPath}
          addButtonDisabled={this.props.addButtonDisabled}
          propertyTemplate={property}>
          {propertyJsx}
        </PropertyTypeRow>,
      )
    }

    this.setState({ propertyTypeRow: newOutput, rowAdded: true })
  }

  render() {
    return (
      <div className="rtOutline" key={shortid.generate()}>
        <OutlineHeader pt={this.props.propertyTemplate}
                       id={resourceToName(this.props.propertyTemplate.propertyURI)}
                       collapsed={this.state.collapsed}
                       key={shortid.generate()}
                       handleCollapsed={this.handleClick(this.props.propertyTemplate)} />
        <div className={this.outlineRowClass()}>
          {this.state.propertyTypeRow}
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
}

export default PropertyTemplateOutline
