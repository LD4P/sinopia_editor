// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import PropertyPanel from './PropertyPanel'
import PropertyResourceTemplate from './PropertyResourceTemplate'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import {getLD, setItems, removeAllContent} from '../../actions/index'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
const N3 = require('n3')
const { DataFactory } = N3
const { blankNode } = DataFactory

// renders the input form for a ResourceTemplate
class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
    this.state = {
      showRdf: false,
      rdfOuterSubject: this.makeSubject(),
      inputs: {}
    }
  }

  defaultValues = () => {
    this.props.propertyTemplates.map( (pt) =>{
      if (pt.mandatory == undefined) pt.mandatory = "true"
      if (pt.repeatable == undefined) pt.repeatable = "false"
      if (pt.editable == undefined) pt.editable = "true"
    })
  }

  makeSubject = () => {
    // in the future we will return a blank node or an IRI (using namedNode in the DataFactory ^^)...
    // return namedNode('http://example.com')
    return blankNode()
  }

  rdfClose = () => {
    this.setState( { showRdf: false } )
  }

  // TODO: deal with more than one default value?
  defaultsForLiteral = (content, predicate) => {
    return [{
      content: content,
      id: 0,
      bnode: this.state.rdfOuterSubject,
      propPredicate: predicate
    }]
  }

  setDefaultsForLiteralWithPayLoad = (button, propURI, propPredicate, defaults, rtid) => {
    let useUri
    propPredicate !== undefined ? useUri = propPredicate : useUri = propURI

    const payload = {
      id: button,
      uri: useUri,
      items: defaults,
      rtId: rtid
    }

    if (defaults != undefined) {
      this.props.handleMyItemsChange(payload)
    }
  }

  getContentForModalButton = (rtId) => {
    let content
    let resourceTemplate = getResourceTemplate(rtId)
    const pt = resourceTemplate.propertyTemplates[0]
    if (this.isLiteralWithDefaultValue(pt)) {
      content = pt.valueConstraint.defaults[0].defaultLiteral
    }
    return content
  }

  // Note: rtIds is expected to be an array of length at least one
  resourceTemplateFields = (rtIds) => {
    const rtProperties = []
    rtIds.map((rtId, i) => {
      rtProperties.push(<PropertyResourceTemplate key={shortid.generate()} resourceTemplate={getResourceTemplate(rtId)} />)
      if ((rtIds.length - i) > 1) {
        rtProperties.push(<hr key={i} />)
      }
    })
    return rtProperties
  }

  defaultValues = () => {
    this.props.propertyTemplates.map((pt) => {
      if (pt.mandatory == undefined) pt.mandatory = "true"
      if (pt.repeatable == undefined) pt.repeatable = "false"
      if (pt.editable == undefined) pt.editable = "true"
    })
  }

  isLiteralWithDefaultValue = (pt) => {
    return Boolean(
      pt.type === 'literal' &&
      pt.valueConstraint !== undefined &&
      pt.valueConstraint.defaults !== undefined &&
      pt.valueConstraint.defaults.length > 0
    )
  }

  isResourceWithValueTemplateRef = (pt) => {
    return Boolean(
      pt.type === 'resource' &&
      pt.valueConstraint != null &&
      pt.valueConstraint.valueTemplateRefs != null &&
      pt.valueConstraint.valueTemplateRefs.length > 0
    )
  }

  setInputs() {
    let inputs = {}
    inputs['literals'] = this.props.literals
    inputs['lookups'] = this.props.lookups
    inputs['rtId'] = this.props.rtId
    inputs['resourceURI'] = this.props.resourceTemplate.resourceURI
    inputs['linkedNode'] = this.state.rdfOuterSubject
    return inputs
  }

  handleTrashValue = (buttonIndex) => {
    this.props.handleRemoveAllContent(buttonIndex)
  }

  renderValueForButton(buttonValue, buttonIndex) {
    if (buttonValue != undefined) {
      return (
        <div className="btn-group btn-group-xs">
          <button type="button" className="btn btn-sm btn-default">{buttonValue}</button>
          <button disabled className="btn btn-warning" type="button">
            <span className="glyphicon glyphicon-pencil"/>
          </button>
          <button className="btn btn-danger" type="button" onClick={() => this.handleTrashValue(buttonIndex)}>
            <span className="glyphicon glyphicon-trash"/>
          </button>
        </div>
      )
    }
  }

  render() {

    if (this.props.propertyTemplates.length === 0 || this.props.propertyTemplates[0] === {}) {
      return <h1>There are no propertyTemplates - probably an error.</h1>
    } else {
      return (
        <div>

          <form>
            <div className='ResourceTemplateForm row'>
                  { this.props.propertyTemplates.map( (pt, index) => {

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

                    if (listComponent === 'list'){
                      return (
                        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                          <InputListLOC propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
                        </PropertyPanel>
                      )
                    }
                    else if (listComponent ===  'lookup'){
                      return(
                        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                          <InputLookupQA propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
                        </PropertyPanel>
                      )
                    }
                    else if(pt.type == 'literal'){
                      return(
                        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                          <InputLiteral key={index} id={index}
                                        propertyTemplate={pt}
                                        rtId={this.props.rtId}
                                        blankNodeForLiteral={this.state.rdfOuterSubject}
                                        propPredicate={this.props.propPredicate}
                                        defaultsForLiteral={this.defaultsForLiteral}
                                        setDefaultsForLiteralWithPayLoad={this.setDefaultsForLiteralWithPayLoad} />
                        </PropertyPanel>
                      )
                    }
                    else if (this.isResourceWithValueTemplateRef(pt)) {
                      let valueForButton
                      return (
                        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                            {this.resourceTemplateFields(pt.valueConstraint.valueTemplateRefs)}
                            {this.renderValueForButton(valueForButton, index)}
                        </PropertyPanel>
                        )
                      }
                      else if (pt.type == 'resource'){
                        return (<p key={index}><b>{pt.propertyLabel}</b>: <i>NON-modal resource</i></p>)
                      }
                    }
                  )
                 }

            </div>
          </form>
        </div>
      )
    }
  }
}

ResourceTemplateForm.propTypes = {
  literals: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  lookups: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleGenerateLD: PropTypes.func,
  propertyTemplates: PropTypes.arrayOf(PropTypes.object).isRequired,
  resourceTemplate: PropTypes.object.isRequired,
  rtId: PropTypes.string,
  parentResourceTemplate: PropTypes.string,
  rdfOuterSubject: PropTypes.object,
  propPredicate: PropTypes.string,
  buttonID: PropTypes.number,
  generateLD: PropTypes.object.isRequired,
  handleMyItemsChange: PropTypes.func,
  handleRemoveAllContent: PropTypes.func
}

const mapStateToProps = (state) => {
  return {
    literals: state.literal,
    lookups: state.lookups,
    generateLD: state.generateLD
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(user_input){
    dispatch(setItems(user_input))
  },
  handleRemoveAllContent(id){
    dispatch(removeAllContent(id))
  },
  handleGenerateLD(inputs){
    dispatch(getLD(inputs))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(ResourceTemplateForm)
