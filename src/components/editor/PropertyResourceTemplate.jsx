// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'


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

  isRequired = () => {
    console.log(this.props.propertyTemplate.mandatory)
    if (this.props.propertyTemplate.mandatory === "true") {
      return <RequiredSuperscript />
    }
  }

  generateInputs = () => {
    const output = []
    switch (this.props.propertyTemplate.type) {
      case "literal":
        // output.push(<InputLiteral id={1} rtId={null} />)
        output.push(<OutlineHeader spacer={1}
            label={this.props.propertyTemplate.propertyLabel}
             />)
        console.log(`Generate <InputLiteral />`)
        // output.push(<PropertyTemplateOutline propertyTemplate={this.props.propertyTemplate} />)
        break;

      case "resource":
        console.log(`Generate <PropertyResourceTemplate /> or <InputListLOC />`)
        break;

      case "lookup":
        console.log(`Generate <InputLookupQA />`)
        break;
    }
    return output
  }

  render() {
    return(
      <div className="rtOutline">
        <OutlineHeader label={this.props.propertyTemplate.propertyLabel}
          collapsed={this.state.collapsed}
          isRequired={this.isRequired()}
          handleCollapsed={this.handleCollapsed} />

        <div className="rOutline-property">
          {this.generateInputs()}
        </div>
      </div>
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
    let icon = 'faChevronDown'
    return (
      <div className="pull-right">
        <FontAwesomeIcon icon={icon} />
      </div>)
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
                    key={`propRT-` + i}
                    count={i}  />)
          })
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
