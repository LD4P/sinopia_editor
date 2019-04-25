// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import PropertyPanel from './PropertyPanel'
import PropertyResourceTemplate from './PropertyResourceTemplate'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import { getLD, setItems, removeAllContent } from '../../actions/index'
import { getResourceTemplateFromServer } from '../../sinopiaServer'
const N3 = require('n3')
const { DataFactory } = N3
const { blankNode } = DataFactory
const _ = require('lodash')

// renders the input form for a ResourceTemplate
export class ResourceTemplateForm extends Component {
  constructor(props) {
    super(props)
    this.defaultValues()
    this.state = {
      showRdf: false,
      rdfOuterSubject: this.makeSubject(),
      inputs: {},
      nestedResourceTemplates: [],
      ptRtIds: [],
      templateError: false,
      componentForm: <div/>
    }
  }

  componentDidMount() {
    this.fullfillRTPromises(this.resourceTemplatePromises(this.joinedRTs())).then(() => {
      this.setState({
        componentForm: (
          this.renderComponentForm()
        )
      })
    })
  }

  fullfillRTPromises = async (promiseAll) => {
    await promiseAll.then(async (rts) => {
      rts.map(rt => {
        this.setState({tempState: rt.response.body})
        const joinedRts = this.state.nestedResourceTemplates.slice(0)
        joinedRts.push(this.state.tempState)
        this.setState({nestedResourceTemplates: joinedRts})
      })
    }).catch((err) => {
      this.setState({templateError: err})
    })
  }

  resourceTemplatePromises = async (templateRefs) => {
    return Promise.all(templateRefs.map(rtId =>
      getResourceTemplateFromServer('ld4p', rtId)
    ))
  }

  joinedRTs = () => {
    let joined = []
    this.props.propertyTemplates.map(pt => {
      if(_.has(pt.valueConstraint, 'valueTemplateRefs')) {
        joined = joined.concat(pt.valueConstraint.valueTemplateRefs)
      }
    })
    return joined
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

  // Note: rtIds is expected to be an array of length at least one
  resourceTemplateFields = (rtIds, propUri) => {
    const rtProperties = []
    rtIds.map((rtId, i) => {
      const rt = this.rtForPt(rtId)
      if (rt !== undefined) {
        rtProperties.push(<PropertyResourceTemplate
          key={shortid.generate()}
          resourceTemplate={rt}
          reduxPath={[this.props.rtId, propUri, rtId]} />)
        if ((rtIds.length - i) > 1) {
          rtProperties.push(<hr key={i} />)
        }
      } else {
        this.setState({templateError: true})
      }
    })
    return rtProperties
  }

  rtForPt = (rtId) => {
    return _.find(this.state.nestedResourceTemplates, ['id', rtId])
  }

  isResourceWithValueTemplateRef = ( pt ) => {
    return Boolean(
      pt.type === 'resource' &&
      pt.valueConstraint != null &&
      pt.valueConstraint.valueTemplateRefs != null &&
      pt.valueConstraint.valueTemplateRefs.length > 0
    )
  }

  configuredComponent = (pt, index) => {
    let lookupConfigItem, templateUri, listComponent, result

    if (_.find([pt], 'valueConstraint.useValuesFrom')) {
      templateUri = pt.valueConstraint.useValuesFrom[0]
    }

    for(var i in lookupConfig){
      lookupConfigItem = Object.getOwnPropertyDescriptor(lookupConfig, i)
      if(lookupConfigItem.value.uri === templateUri){
        listComponent = lookupConfigItem.value.component
        break
      }
    }

    if (listComponent === 'list'){
      result = (
        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
          <InputListLOC propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
        </PropertyPanel>
      )
    } else if (listComponent ===  'lookup'){
      result = (
        <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
          <InputLookupQA propertyTemplate = {pt} lookupConfig = {lookupConfigItem} key = {index} rtId = {this.props.rtId} />
        </PropertyPanel>
      )
    } else result = false

    return result
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

  renderComponentForm = () => (
    <div>
      <form>
        <div className='ResourceTemplateForm row'>
          { this.props.propertyTemplates.map((pt, index) => {

              const configuredComponentType = this.configuredComponent(pt, index)

              if (configuredComponentType) {
                return configuredComponentType
              }
              else if(pt.type == 'literal'){
                return(
                  <PropertyPanel pt={pt} key={index} float={index} rtId={this.props.rtId}>
                    <InputLiteral key={index} id={index}
                                  propertyTemplate={pt}
                                  rtId={this.props.rtId}
                                  reduxPath={[this.props.rtId, pt.propertyURI]} />
                  </PropertyPanel>
                )
              }  else if (this.isResourceWithValueTemplateRef(pt)) {
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

  render() {
    const errMessage = <div className="alert alert-warning">
      There are missing resource templates required by resource template: <strong>{this.props.resourceTemplate.resourceURI}</strong>.
      <br />
      Make sure all referenced templates in property template are uploaded first
    </div>;

    if (this.state.templateError) {
      return errMessage
    } else {
      return this.state.componentForm
    }
  }
}

ResourceTemplateForm.propTypes = {
  literals: PropTypes.oneOfType( [PropTypes.array, PropTypes.object] ),
  lookups: PropTypes.oneOfType( [PropTypes.array, PropTypes.object] ),
  handleGenerateLD: PropTypes.func,
  propertyTemplates: PropTypes.arrayOf( PropTypes.object ).isRequired,
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

const mapStateToProps = ( state ) => {
  return {
    literals: state.literal,
    lookups: state.lookups,
    generateLD: state.generateLD
  }
}

const mapDispatchToProps = dispatch => ( {
  handleMyItemsChange( user_input ) {
    dispatch( setItems( user_input ) )
  },
  handleRemoveAllContent( id ) {
    dispatch( removeAllContent( id ) )
  },
  handleGenerateLD( inputs ) {
    dispatch( getLD( inputs ) )
  }
} )

export default connect( mapStateToProps, mapDispatchToProps )( ResourceTemplateForm)
