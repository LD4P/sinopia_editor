// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

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
      // if (depth <= 5) {
        let resourceTemplate = getResourceTemplate(rtId)
        output.push(<h5>{resourceTemplate.resourceLabel}</h5>)
        resourceTemplate.propertyTemplates.map((row) => {
            output.push(<OutlineHeader label={row.propertyLabel}
              isRequired={this.isRequired(row)}
              handleCollapsed={this.handleCollapsed}
              collapsed={true} />)
          })
         // }
        // output.push(<PropertyResourceTemplate resourceTemplate={getResourceTemplate(rtId)} />)
        // output.push(<h4>{resourceTemplate.resourceLabel}</h4>)
        // resourceTemplate.propertyTemplates.map((row, i) => {
        //     output.push(<OutlineHeader label={row.propertyLabel}
        //       isRequired={this.isRequired(row)}
        //       handleCollapsed={this.handleCollapsed}
        //       collapsed={true} />)


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

class PropertyResourceTemplate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collapse: false
    }
  }


  isCollapsed  = () => {

  }

  handleAddClick = (event) => {
     event.preventDefault()
   }

  isCollapsed = () => {

  }


  render() {
    return (
      <div>
        <div className="row">
          <section className="col-md-8">
            <h4>{this.props.resourceTemplate.resourceLabel}</h4>
            {this.isCollapsed()}
          </section>
          <section className="col-md-4">
            <div className="btn-group" role="group" aria-label="...">
              <button onClick={this.handleMintUri} className="btn btn-success btn-sm">Mint URI</button>
              <button className="btn btn-default btn-sm" onClick={this.handleAddClick}>Add</button>
            </div>
          </section>
        </div>
        <div>
        {
          this.props.resourceTemplate.propertyTemplates.map((property, i) => {
            return(<PropertyTemplateOutline
                    propertyTemplate={property}
                    key={`propRT-` + i} />)
        }
        </div>
      </div>
    )
  }
}

PropertyResourceTemplate.propTypes = {
  resourceTemplate: PropTypes.object
}

export default PropertyResourceTemplate;
