// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import RequiredSuperscript from './RequiredSuperscript'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons'


export class PropertyTemplateOutline extends Component {

  constructor(props) {
    super(props)
    this.state = {
      label: this.props.propertyTemplate.propertyLabel,
      collapsed: true
    }
  }

  handleCollapsed = (event) => {
    event.preventDefault()
    this.setState( { collapsed: !this.state.collapsed })
  }

  isCollapsed = () => {
    if(this.state.collapsed == true) {
      return faPlusSquare
    }
    return faMinusSquare
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
        <div className="rOutline-header">
          <a href="#"  onClick={this.handleCollapsed}>
            <FontAwesomeIcon icon={this.isCollapsed()} />&nbsp;
          </a>
          {this.state.label}
          {this.isRequired()}
        </div>
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
      collapse: true
    }
  }

  handleAddClick = (event) => {
     event.preventDefault()
     console.log(`In AddClick`)
  }

  render() {
    return (
      <div>
        <div className="row">
          <section className="col-md-10">
            <h4>{this.props.resourceTemplate.resourceLabel}</h4>
          </section>
          <section className="col-md-2">
            <button className="btn btn-default" onClick={this.handleAddClick}>Add</button>
          </section>
        </div>
        <div>
        {
          this.props.resourceTemplate.propertyTemplates.map((property, i) => {
            return(<PropertyTemplateOutline propertyTemplate={property} count={i} />)
          })
        }
        </div>
      </div>
    )
  }
}

// const mapStateToProps = (state, props) => {
//   return ( {
//
//   })
// }
//
// const mapDispatchToProps = dispatch => ({
//
// })

export default PropertyResourceTemplate;
// export default connect(mapStateToProps, mapDispatchToProps)(PropertyResourceTemplate)
