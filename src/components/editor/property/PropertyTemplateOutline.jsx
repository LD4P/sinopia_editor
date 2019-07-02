// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import { booleanPropertyFromTemplate, isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import { fetchResourceTemplate } from 'actionCreators'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'

const templateRefList = (propertyTemplate) => (isResourceWithValueTemplateRef(propertyTemplate) ?
    propertyTemplate.valueConstraint.valueTemplateRefs : [])

class PropertyTemplateOutline extends Component {
  constructor(props) {
    super(props)

    this.state = {
      collapsed: true,
    }
    console.log(`initialize ${props.propertyTemplate.propertyLabel}`)
  }

  componentDidMount() {
    console.log(`mounted ${this.props.propertyTemplate.propertyLabel}`)

  }

  componentDidUpdate() {
    console.log(`updated ${this.props.propertyTemplate.propertyLabel}`)

  }

  outlineRowClass = () => {
    let classNames = 'rOutline-property'

    if (this.state.collapsed) { classNames += ' collapse' }

    return classNames
  }

  handleAddClick = (event) => {
    event.preventDefault()
    this.addPropertyTypeRows()
  }

  // fulfillRTPromises = async promiseAll => await promiseAll.then((rts) => {
  //   rts.map((fulfilledResourceTemplateRequest) => {
  //     const joinedRts = [...this.state.nestedResourceTemplates]
  //
  //     joinedRts.push(fulfilledResourceTemplateRequest.response.body)
  //     // Add the resource template into the store
  //     store.dispatch(resourceTemplateLoaded(fulfilledResourceTemplateRequest.response.body))
  //     this.setState({ nestedResourceTemplates: joinedRts })
  //   })
  // }).catch(() => {})

  // resourceTemplatePromises = templateRefs => Promise.all(templateRefs.map(rtId => getResourceTemplate(rtId)))

  // When the plus button is clicked, load reference templates (property.valueConstraint.valueTemplateRefs)
  handleTogglePlusButton = (event) => {
    event.preventDefault()
    //this.toggleCollapsed()

    if (this.isCollapsed() && !this.hasAddedARow()) {
      this.addChildRow()
    }
    this.toggleCollapsed()
  }

  addChildRow() {
    if (isResourceWithValueTemplateRef(this.props.propertyTemplate)) {
      this.loadResourceTemplates()
    } else {
      this.addPropertyTypeRows()
    }
  }

  loadResourceTemplates() {
    this.fulfillRTPromises(
      this.resourceTemplatePromises(this.props.propertyTemplate.valueConstraint.valueTemplateRefs),
    ).then(() => this.addPropertyTypeRows())
  }

  isCollapsed() {
    return this.state.collapsed
  }

  hasAddedARow() {
    return this.state.rowAdded
  }

  rowAdded() {
    this.setState({ rowAdded: true })
  }

  toggleCollapsed() {
    this.setState({ collapsed: !this.state.collapsed })
  }

  // addPropertyTypeRows() {
  //   const property = this.props.propertyTemplate
  //   const newOutput = [...this.state.propertyTypeRow]
  //   newOutput.push(property)
  //   this.setState({ propertyTypeRow: newOutput, rowAdded: true })
  // }

  renderPropertyRows = () => {
    if (this.state.collapsed) {
      return
    }
    console.log("rendering")
    console.log(this.props.models)
    return this.props.models.map((property, index) => (
      <PropertyTypeRow
        key={shortid.generate()}
        handleAddClick={this.props.handleAddClick}
        reduxPath={this.props.reduxPath}
        addButtonDisabled={this.props.addButtonDisabled}
        propertyTemplate={property}>
        { this.renderOneProperty(property, index) }
      </PropertyTypeRow>
    ))
  }

  renderOneProperty = (property, index) => {

    if (isResourceWithValueTemplateRef(property)) {
      const isAddDisabled = !booleanPropertyFromTemplate(property, 'repeatable', false) || index > 0
      console.log("PropertyTemplateOutline: rendering resource property for")
      console.log(property)
      return (<ResourceProperty key={shortid.generate()}
                                propertyTemplate={property}
                                reduxPath={this.props.reduxPath}
                                nestedResourceTemplates={this.props.nestedResourceTemplates}
                                handleAddClick={this.handleAddClick}
                                addButtonDisabled={isAddDisabled} />)
    }
    console.log("A property component")
    console.log(property)

    return (<PropertyComponent key={shortid.generate()} propertyTemplate={property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    console.log("rerendering")
    return (
      <div className="rtOutline" data-label={this.props.propertyTemplate.propertyLabel}>
        <OutlineHeader pt={this.props.propertyTemplate}
                       id={resourceToName(this.props.propertyTemplate.propertyURI)}
                       collapsed={this.state.collapsed}
                       key={shortid.generate()}
                       handleCollapsed={this.handleTogglePlusButton} />
        <div className={this.outlineRowClass()}>
          {this.renderPropertyRows()}
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
  models: PropTypes.array,
  nestedResourceTemplates: PropTypes.array,
  toggleButtonPushed: PropTypes.func,
}

const mapStateToProps = (state, ourProps) => {
  const models = [ourProps.propertyTemplate] // add more to this list to add more rows
  const nestedResourceTemplates = templateRefList(ourProps.propertyTemplate)
    .map((resourceTemplateId) => (state.selectorReducer.entities.resourceTemplates[resourceTemplateId]))


  return {
    models,
    nestedResourceTemplates,
  }
}

const mapDispatchToProps = (dispatch, ourProps) => ({
  toggleButtonPushed: (isCollapsed, isRowAdded, that) => {
    if (!isRowAdded) {
      that.rowAdded()
      console.log("Load these")
      console.log(templateRefList(ourProps.propertyTemplate))
      templateRefList(ourProps.propertyTemplate).forEach((templateReference) => dispatch(fetchResourceTemplate(templateReference)))
      console.log("load complete")
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyTemplateOutline)
