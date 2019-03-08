// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import InputLiteral from './InputLiteral'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import RequiredSuperscript from './RequiredSuperscript'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
import PropTypes from 'prop-types'

const PanelContext = React.createContext()

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
        let resourceTemplate = getResourceTemplate(rtId)
        output.push(<h5>{resourceTemplate.resourceLabel}</h5>)
        resourceTemplate.propertyTemplates.map((row) => {
            output.push(<OutlineHeader label={row.propertyLabel}
              isRequired={this.isRequired(row)}
              spacer={depth}
              handleCollapsed={this.handleCollapsed}
              collapsed={true} />)
          })
      return (output)
    } else {
      switch (property.type) {
        case "literal":
          output.push(
              <InputLiteral id={property.propertyURI}
                propertyTemplate={property}
                rtId={rtId} />
          )
          break;

        case "resource":
          output.push(<input className="form-control" placeholder="Lookup" />)

          break;

        case "lookup":
          output.push(
              <input className="form-control"
                placeholder="Generate InputLookupQA" />
          )
          break;
      }
     return (<PropertyTypeRow key={this.props.count} propertyTemplate={property}>
            {output}
           </PropertyTypeRow>)
    }
  }

  render() {
    return(
      <PanelContext.Provider resourceTemplate={this.props.rtId}>
        <div className="rtOutline">
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
        </div>
      </PanelContext.Provider>
    )
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
