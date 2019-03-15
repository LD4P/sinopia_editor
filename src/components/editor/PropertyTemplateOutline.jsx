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
      collapsed: true,
      output: []
    }
  }

  getLookupConfigItem = (property) => {
    let templateUri = property.valueConstraint.useValuesFrom[0]
    lookupConfig.forEach((configItem) => {
      if (configItem.uri === templateUri) {
        return { value: configItem }
      }
    })
  }

  handleCollapsed = (property) => (event) => {
    event.preventDefault()
    let newOutput = this.state.output

    let input

    switch (property.type) {
      case "literal":
        input = <InputLiteral id={this.props.count}
              propertyTemplate={property}
              key={shortid.generate()}
              rtId={property.rtId} />
        break;

      case "resource":
          if (this.valueTemplateRefTest(property)){
            input = []
            property.valueConstraint.valueTemplateRefs.map((rtId, i) => {
              let resourceTemplate = getResourceTemplate(rtId)
              resourceTemplate.propertyTemplates.map((rtProperty) => {
                input.push(<PropertyTemplateOutline propertyTemplate={rtProperty}
                  resourceTemplate={getResourceTemplate(rtId)} />)
              })
            })
            break;
          }
          let lookupConfigItem = this.getLookupConfigItem(property)
          input = <InputListLOC propertyTemplate = {property}
               lookupConfig = {lookupConfigItem}
               rtId = {property.rtId} />

          break;
    }
    // Needs to dedup property in state before pushing
    newOutput.push(<PropertyTypeRow key={shortid.generate()} propertyTemplate={property}>
      {input}
    </PropertyTypeRow>)
    this.setState( { collapsed: !this.state.collapsed,
                     output: newOutput })
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

  render() {
    return(<div className="rtOutline">
            <OutlineHeader label={this.props.propertyTemplate.propertyLabel}
              collapsed={this.state.collapsed}
              isRequired={this.isRequired(this.props.propertyTemplate)}
              handleCollapsed={this.handleCollapsed(this.props.propertyTemplate)} />
            <div className={this.outlinerClasses()}>{this.state.output}</div>
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
