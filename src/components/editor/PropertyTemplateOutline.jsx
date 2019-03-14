// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import RequiredSuperscript from './RequiredSuperscript'
import { getResourceTemplate } from '../../sinopiaServer'
import lookupConfig from '../../../static/spoofedFilesFromServer/fromSinopiaServer/lookupConfig.json'
import PropTypes from 'prop-types'
import shortid from 'shortid'



export class PropertyTemplateOutline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collapsed: true
    }
  }

  handleCollapsed = (event) => {
    event.preventDefault()
    this.setState( { collapsed: !this.state.collapsed })
  }

  getRtOrHandleCollapsed = (property) => (event) => {
      event.preventDefault()
  }

  isRequired = (property) => {
    if (property.mandatory === "true") {
      return <RequiredSuperscript />
    }
  }

  outlinerClasses = () => {
    let classNames = "rOutline-property"
    if (this.state.collapsed) { classNames += " collapse"}
    return classNames
  }

  valueTemplateRefTest = (property) => {
    return Boolean(property.valueConstraint != null &&
     property.valueConstraint.valueTemplateRefs != null &&
     property.valueConstraint.valueTemplateRefs.length > 0)
  }

  generateInputs = (property, rtId, depth) => {
    const output = []
    if(this.valueTemplateRefTest(property)) {
      property.valueConstraint.valueTemplateRefs.map((row, i) => {
        let resourceTemplate = getResourceTemplate(row)
        output.push(<h5 key={shortid.generate()}>{resourceTemplate.resourceLabel}</h5>)
        resourceTemplate.propertyTemplates.map((row) => {
          output.push(<div key={shortid.generate()} className="internalPropertyTemplate">
            <OutlineHeader label={row.propertyLabel}
            isRequired={this.isRequired(row)}
            spacer={depth}
            handleCollapsed={this.getRtOrHandleCollapsed(row)}
            collapsed={true} />
          </div>)
        })
      })
      return (output)
    } else {
      switch (property.type) {
        case "literal":
          output.push(
              <InputLiteral id={this.props.count}
                propertyTemplate={property}
                key={shortid.generate()}
                rtId={rtId} />
          )
          break;

        case "resource":
          let templateUri = property.valueConstraint.useValuesFrom[0]
          let lookupConfigItem
          lookupConfig.forEach((configItem) => {
            if (configItem.uri === templateUri) {
              lookupConfigItem = { value: configItem }
            }
          })
          output.push(
            <InputListLOC propertyTemplate = {property}
               lookupConfig = {lookupConfigItem}
               rtId = {rtId} />
          )
          break;

        case "lookup":

          output.push(
              <input className="form-control"
                key={shortid.generate()}
                placeholder="Generate InputLookupQA" />
          )
          break;
      }
     return (<PropertyTypeRow key={shortid.generate()} propertyTemplate={property}>
            {output}
           </PropertyTypeRow>)
    }
  }

  render() {
    return(<div className="rtOutline">
            <OutlineHeader label={this.props.propertyTemplate.propertyLabel}
              collapsed={this.state.collapsed}
              isRequired={this.isRequired(this.props.propertyTemplate)}
              handleCollapsed={this.handleCollapsed} />
              <div className={this.outlinerClasses()}>
                {this.generateInputs(
                  this.props.propertyTemplate,
                  this.props.rtId,
                  this.props.depth ? this.props.depth : 0)}
              </div>
        </div>)
  }

}

PropertyTemplateOutline.propTypes = {
  count: PropTypes.number,
  depth: PropTypes.number,
  handleCollapsed: PropTypes.func,
  isRequired: PropTypes.func,
  propertyTemplate: PropTypes.object,
  rtId: PropTypes.string
}

export default PropertyTemplateOutline;
