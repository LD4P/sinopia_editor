// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

const PanelContext = React.createContext({
  collapsed: true
})

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
    if (this.props.propertyTemplate.mandatory === "true") {
      return <RequiredSuperscript />
    }
  }

  generateInputs = () => {
    const output = []

    switch (this.props.propertyTemplate.type) {
      case "literal":
        // output.push(
        //     <InputLiteral id={this.props.propertyTemplate.propertyURI}
        //       propertyTemplate={this.props.propertyTemplate}
        //       rtId={this.props.rtId} />
        // )
        break;

      case "resource":
        output.push(
            <input className="form-control"
              placeholder="PropertyResourceTemplate or InputListLOC" />
        )
        break;

      case "lookup":
        output.push(
            <input className="form-control"
              placeholder="Generate InputLookupQA" />
        )
        break;

    }
    return output
  }

  render() {
    console.log(`PropertyResourceTemplate`)
    console.warn(this.props)
    return(
      <PanelContext.Provider resourceTemplate={this.props.rtId}>
        <div className="rtOutline">
          <OutlineHeader label={this.props.propertyTemplate.propertyLabel}
            collapsed={this.state.collapsed}
            isRequired={this.isRequired()}
            handleCollapsed={this.handleCollapsed} />
          <div className="rOutline-property">
            <PropertyTypeRow key={this.props.count} propertyTemplate={this.props.propertyTemplate}>
              {this.generateInputs()}
            </PropertyTypeRow>
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
