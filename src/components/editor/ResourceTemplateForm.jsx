// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import ModalToggle from './ModalToggle'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')

class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.rtModalButton = this.rtModalButton.bind(this)
    this.resourceTemplateButtons = this.resourceTemplateButtons.bind(this)
    this.defaultValues = this.defaultValues.bind(this)
    this.defaultValues()
  }

  rtModalButton = (rtId) => {
    let resourceTemplate = getResourceTemplate(rtId)
    return (
      <ModalToggle
        key={rtId}
        rtId={rtId}
        buttonLabel={resourceTemplate.resourceLabel}
        propertyTemplates ={resourceTemplate.propertyTemplates}
      />
    )
  }

  // Note: rtIds is expected to be an array of length at least one
  resourceTemplateButtons = (rtIds) => {
    let buttons = []
    rtIds.map((rtId, i) => {
      buttons.push(<ButtonGroup key={`${rtId}-${i}`}>{this.rtModalButton(rtId)}</ButtonGroup>)
    })
    return buttons
  }

  defaultValues = () => {
    this.props.propertyTemplates.map( (pt) =>{
      if (pt.mandatory == undefined) pt.mandatory = "true"
      if (pt.repeatable == undefined) pt.repeatable = "false"
      if (pt.editable == undefined) pt.editable = "true"
    })
  }

  render() {
    let dashedBorder = {
      border: '1px dashed',
      padding: '10px',
    }
    if (this.props.propertyTemplates.length === 0 || this.props.propertyTemplates[0] === {}) {
      return <h1>There are no propertyTemplates - probably an error.</h1>
    } else {
      return (
        <form style={dashedBorder}>
          <div className='ResourceTemplateForm'>
            <p>BEGIN ResourceTemplateForm</p>
              <div>
                {this.props.propertyTemplates.map( (pt, index) => {

                  let isLookupWithConfig = Boolean(
                    lookupConfig !== undefined &&
                    pt.valueConstraint !== undefined &&
                    pt.valueConstraint.useValuesFrom
                  )

                  let lookupConfigItem, templateUri, listComponent

                  if (isLookupWithConfig) {
                    templateUri = pt.valueConstraint.useValuesFrom[0]
                    for(var i in lookupConfig){
                      lookupConfigItem = Object.getOwnPropertyDescriptor(lookupConfig, i)
                      if(lookupConfigItem.value.uri === templateUri){
                        listComponent = lookupConfigItem.value.component
                        break
                      }
                    }
                  }

                  let isResourceWithValueTemplateRefs = Boolean(
                    pt.type == 'resource' &&
                    pt.valueConstraint != null &&
                    pt.valueConstraint.valueTemplateRefs != null
                    && pt.valueConstraint.valueTemplateRefs.length > 0
                  )

                  if (listComponent === 'list'){
                    return (
                      <InputListLOC propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} />
                    )
                  }
                  else if (listComponent ===  'lookup'){
                    return(
                      <InputLookupQA propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} />
                    )
                  }
                  else if(pt.type == 'literal'){
                    return(
                      <InputLiteral propertyTemplate = {pt} key = {index} id = {index} />
                    )
                  }
                  else if (isResourceWithValueTemplateRefs) {
                    // TODO: some valueTemplateRefs may be lookups??
                    return (
                      <ButtonToolbar key={index}>
                        <div>
                          <b>{pt.propertyLabel}</b>
                        </div>
                        {this.resourceTemplateButtons(pt.valueConstraint.valueTemplateRefs)}
                      </ButtonToolbar>
                    )
                  }
                  else if (pt.type == 'resource'){
                    return (<p key={index}><b>{pt.propertyLabel}</b>: <i>NON-modal resource</i></p>)
                  }
                })}
              </div>
            <p>END ResourceTemplateForm</p>
          </div>
        </form>
      )
    }
  }
}

ResourceTemplateForm.propTypes = {
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  lookupConfig: PropTypes.object
}

export default ResourceTemplateForm
