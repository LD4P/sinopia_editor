// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import { getResourceTemplate } from '../../../sinopiaServer'
import { isResourceWithValueTemplateRef, resourceToName, templateBoolean } from '../../../Utilities'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'

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

  handleAddClick = (event) => {
    event.preventDefault()
    this.addPropertyTypeRows(this.props.propertyTemplate)
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
    const newOutput = [...this.state.propertyTypeRow]
    let propertyJsx

    if (isResourceWithValueTemplateRef(property)) {
      const isAddDisabled = !templateBoolean(property.repeatable) || newOutput.length > 0

      propertyJsx = <ResourceProperty key={shortid.generate()}
                                      propertyTemplate={property}
                                      reduxPath={this.props.reduxPath}
                                      nestedResourceTemplates={this.state.nestedResourceTemplates}
                                      handleAddClick={this.handleAddClick}
                                      addButtonDisabled={isAddDisabled} />
    } else {
      propertyJsx = <PropertyComponent key={shortid.generate()} propertyTemplate={property} reduxPath={this.props.reduxPath} />
    }

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

    this.setState({ propertyTypeRow: newOutput, rowAdded: true })
  }

  render() {
    return (
      <div className="rtOutline">
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
  isRequired: PropTypes.func,
  propertyTemplate: PropTypes.object,
  reduxPath: PropTypes.array,
  rtId: PropTypes.string,
}

export default PropertyTemplateOutline
