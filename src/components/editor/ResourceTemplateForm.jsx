// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import ModalToggle from './ModalToggle'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import { getRDF } from '../../actions/index'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')

class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.rtModalButton = this.rtModalButton.bind(this)
    this.resourceTemplateButtons = this.resourceTemplateButtons.bind(this)
    this.defaultValues = this.defaultValues.bind(this)
    this.previewRDF = this.previewRDF.bind(this)
    this.defaultValues()
  }

  previewRDF = () => {
    const inputs = {}
    inputs['literals'] = this.props.literals
    inputs['lookups'] = this.props.lookups
    inputs['rtId'] = this.props.rtId
    inputs['type'] = this.props.resourceTemplate.resourceURI
    // TODO: Add Modal to inputs
    this.props.handleGenerateRDF(inputs)
  }

  rtModalButton = (rtId, rtType) => {
    let resourceTemplate = getResourceTemplate(rtId)
    return (
      <ModalToggle
        key={rtId}
        rtId={rtId}
        rtType={rtType}
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
                      <InputListLOC propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
                    )
                  }
                  else if (listComponent ===  'lookup'){
                    return(
                      <InputLookupQA propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
                    )
                  }
                  else if(pt.type == 'literal'){
                    return(
                      <InputLiteral propertyTemplate = {pt} key = {index} id = {index} rtId = {this.props.rtId} />
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
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={this.previewRDF}>Preview RDF</button>
          </div>
        </form>
      )
    }
  }
}

ResourceTemplateForm.propTypes = {
  literals: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  lookups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  handleGenerateRDF: PropTypes.func.isRequired,
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string.isRequired
}

const mapStateToProps = (state) => {
  return {
    literals: state.literal,
    lookups: state.lookups
  }
}

const mapDispatchToProps = dispatch => (
  {
  handleGenerateRDF(inputs){
    dispatch(getRDF(inputs))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
