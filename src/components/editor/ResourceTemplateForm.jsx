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
import RDFModal from './RDFModal'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import { getRDF } from '../../actions/index'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
const N3 = require('n3')
const { DataFactory } = N3
const { blankNode } = DataFactory

class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.rtModalButton = this.rtModalButton.bind(this)
    this.resourceTemplateButtons = this.resourceTemplateButtons.bind(this)
    this.defaultValues = this.defaultValues.bind(this)
    this.rdfClose = this.rdfClose.bind(this)
    this.handleRDFDisplay = this.handleRDFDisplay.bind(this)
    this.makeSubject = this.makeSubject.bind(this)
    this.defaultValues()
    this.state = {
      showRdf: false,
      rdfOuterSubject: this.makeSubject()
    }
  }

  makeSubject() {
    // in the future we will return a blank node or an IRI (using namedNode in the DataFactory ^^)...
    // return namedNode('http://example.com')
    return blankNode()
  }

  handleRDFDisplay() {
    this.setState( { showRdf: true } )
    let inputs = {}
    inputs['literals'] = this.props.literals
    inputs['lookups'] = this.props.lookups
    inputs['rtId'] = this.props.rtId
    inputs['type'] = this.props.resourceTemplate.resourceURI
    inputs['linkedNode'] = this.props.rdfOuterSubject
    inputs['linkedPredicate'] = this.props.rdfPredicate
    this.props.handleGenerateRDF(inputs)
  }

  rdfClose = () => {
    this.setState( { showRdf: false } )
  }

  rtModalButton = (rtId, propURI) => {
    let resourceTemplate = getResourceTemplate(rtId)
    return (
      <ModalToggle
        key={rtId}
        rtId={rtId}
        buttonLabel={resourceTemplate.resourceLabel}
        propertyTemplates={resourceTemplate.propertyTemplates}
        resourceTemplate={resourceTemplate}
        rdfOuterSubject = {this.state.rdfOuterSubject}
        rdfPredicate = {propURI}
        handleRDFDisplay = {this.handleRDFDisplay}
      />
    )
  }

  // Note: rtIds is expected to be an array of length at least one
  resourceTemplateButtons = (rtIds, propURI) => {
    let buttons = []
    rtIds.map((rtId, i) => {
      buttons.push(<ButtonGroup key={`${rtId}-${i}`}>{this.rtModalButton(rtId, propURI)}</ButtonGroup>)
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
        <div>
          <div>
            <RDFModal show={this.state.showRdf}
                      close={this.rdfClose}
                      rtId={this.props.rtId}
                      rdfData={ JSON.stringify(this.props.generateRDF) } />
          </div>
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
                          {this.resourceTemplateButtons(pt.valueConstraint.valueTemplateRefs, pt.propertyURI)}
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
                onClick={this.handleRDFDisplay}>Preview RDF</button>
            </div>
          </form>
        </div>
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
  rtId: PropTypes.string,
  parentResourceTemplate: PropTypes.string,
  rdfOuterSubject: PropTypes.string,
  rdfPredicate: PropTypes.string,
  generateRDF: PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
  return {
    literals: state.literal,
    lookups: state.lookups,
    generateRDF: state.generateRDF,

  }
}

const mapDispatchToProps = dispatch => (
  {
  handleGenerateRDF(inputs){
    dispatch(getRDF(inputs))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
