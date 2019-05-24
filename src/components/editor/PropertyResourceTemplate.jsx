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
      collapse: false,
      output: []
    }
    this.populatePropertyTemplates()
  }

  handleAddClick = (event) => {
    event.preventDefault()
    const existingOutputs = this.state.output
    existingOutputs.push(<h4 key={shortid.generate()}>{this.props.resourceTemplate.resourceLabel}</h4>)
    this.populatePropertyTemplates()
    this.setState({ output: existingOutputs})
  }

  handleMintUri = (event) => {
    event.preventDefault()
  }

  populatePropertyTemplates = () => {
    this.props.resourceTemplate.propertyTemplates.map((property) => {
      let keyId = shortid.generate()
      let newReduxPath = Object.assign([], this.props.reduxPath)
      newReduxPath.push(keyId)
      this.state.output.push(<PropertyTemplateOutline
              propertyTemplate={property}
              rtId={this.props.resourceTemplate.id}
              reduxPath={newReduxPath}
              key={keyId} />)
    })
  }

  render() {
    const isAddDisabled = this.props.isRepeatable == "false" ? true : false
    return (<div>
      <div className="row" key={shortid.generate()}>
        <section className="col-md-8">
          <h4>{this.props.resourceTemplate.resourceLabel}</h4>
        </section>
        <section className="col-md-4">
          <PropertyActionButtons
            handleAddClick={this.handleAddClick}
            handleMintUri={this.handleMintUri}
            addButtonDisabled={isAddDisabled}
            reduxPath={this.props.reduxPath}
            key={shortid.generate()} />
        </section>
      </div>
      <div>
      { this.state.output }
      </div>
    </div>
    )
  }
}

PropertyResourceTemplate.propTypes = {
  isRepeatable: PropTypes.string,
  reduxPath: PropTypes.array,
  resourceTemplate: PropTypes.object
}

export default PropertyResourceTemplate;
