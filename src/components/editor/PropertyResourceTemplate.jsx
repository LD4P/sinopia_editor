// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import InputLiteral from './InputLiteral'
import InputListLOC from './InputListLOC'
import InputLookupQA from './InputLookupQA'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import RequiredSuperscript from './RequiredSuperscript'
// import { connect } from 'react-redux'
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
    output.push()

    switch (this.props.propertyTemplate.type) {
      case "literal":
        output.push(<PropertyTypeRow propertyTemplate={this.props.propertyTemplate} />)

        break;

      case "resource":
        output.push(<div className="row">
                      <section className="col-sm-4">
                       {this.props.propertyTemplate.propertyLabel}
                      </section>
                      <section className="col-sm-8">
                        <input className="form-control"
                               placeholder="PropertyResourceTemplate or InputListLOC" />
                      </section>
                    </div>)
        break;

      case "lookup":
        output.push(<div><input className="form-control"
                          placeholder="Generate InputLookupQA" /></div>)
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
        <OutlineHeader spacer={1}
            label={this.props.propertyTemplate.propertyLabel}
          />
        <div className="rOutline-property">
          <p>
          {this.generateInputs()}
          </p>
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

  isCollapsed = () => {

  }


  handleAddClick = (event) => {
     event.preventDefault()
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
                    count={i}  />)
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
