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
import store from '../../../store'
import { resourceTemplateLoaded } from '../../../actions/index'

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
    rts.map((fulfilledResourceTemplateRequest) => {
      const joinedRts = [...this.state.nestedResourceTemplates]

      joinedRts.push(fulfilledResourceTemplateRequest.response.body)
      // Add the resource template into the store
      store.dispatch(resourceTemplateLoaded(fulfilledResourceTemplateRequest.response.body))
      this.setState({ nestedResourceTemplates: joinedRts })
    })
  }).catch(() => {})

  resourceTemplatePromises = templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId)))

  // When the plus button is clicked, load reference templates (property.valueConstraint.valueTemplateRefs)
  handleClick = property => (event) => {
    event.preventDefault()

    if (this.state.collapsed && !this.state.rowAdded) {
      const templateRefList = isResourceWithValueTemplateRef(property) ? property.valueConstraint.valueTemplateRefs : []

      this.fulfillRTPromises(this.resourceTemplatePromises(templateRefList)).then(() => {
        this.addPropertyTypeRows(this.props.propertyTemplate)
      })
    }

    this.setState({ collapsed: !this.state.collapsed })
  }

  addPropertyTypeRows = (property) => {
    const newOutput = [...this.state.propertyTypeRow]
    let propertyJsx

    if (this.state.collapsed) {
      return
    }

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
      <div className="rtOutline" data-label={this.props.propertyTemplate.propertyLabel}>
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
