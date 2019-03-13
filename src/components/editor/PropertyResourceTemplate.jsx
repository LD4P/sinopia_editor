// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import shortid from 'shortid'
import PropTypes from 'prop-types'

class PropertyResourceTemplate extends Component {

  constructor(props) {
    super(props)
    this.state = {
      collapse: false
    }
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
                    key={shortid.generate()}
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
