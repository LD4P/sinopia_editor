// Copyright 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import InputLiteral from './InputLiteral'
// import InputListLOC from './InputListLOC'
// import InputLookupQA from './InputLookupQA'
import OutlineHeader from './OutlineHeader'
import PropertyTypeRow from './PropertyTypeRow'
import RequiredSuperscript from './RequiredSuperscript'
import PropertyTemplateOutline from './PropertyTemplateOutline'
const { getResourceTemplate } = require('../../sinopiaServerSpoof.js')
// import { connect } from 'react-redux'
import PropTypes from 'prop-types'

const PanelContext = React.createContext()



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
        })
        </div>
      </div>
    )
  }
}

PropertyResourceTemplate.propTypes = {
  resourceTemplate: PropTypes.object
}

export default PropertyResourceTemplate;
