// Copyright 2019 Stanford University see Apache2.txt for license

import React, { Component } from 'react'
import PropertyActionButtons from './PropertyActionButtons'
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
     console.log(`in handleAddClick PropertyResourceTemplate`)
  }

  handleMintUri = (event) => {
    event.preventDefault()
  }

  render() {
    return (<div>
      <div className="row" key={shortid.generate()}>
        <section className="col-md-8">
          <h4>{this.props.resourceTemplate.resourceLabel}</h4>
        </section>
        <section className="col-md-4">
          <PropertyActionButtons handleAddClick={this.handleAddClick}
            handleMintUri={this.handleMintUri} key={shortid.generate()} />
        </section>
      </div>
      <div>
      {
        this.props.resourceTemplate.propertyTemplates.map((property) => {
          let newReduxPath = Object.assign([], this.props.reduxPath)
          newReduxPath.push(property.propertyURI)
          return(<PropertyTemplateOutline
                  propertyTemplate={property}
                  rtId={this.props.resourceTemplate.id}
                  reduxPath={newReduxPath}
                  key={shortid.generate()} />)
        })
      }
      </div>
    </div>
    )
  }
}

PropertyResourceTemplate.propTypes = {
  reduxPath: PropTypes.string,
  resourceTemplate: PropTypes.object
}

export default PropertyResourceTemplate;
