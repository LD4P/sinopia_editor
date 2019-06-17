// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'

class PropertyResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
      output: this.populatePropertyTemplates(this.props.reduxPath),
    }
  }

  handleAddClick = (event) => {
    event.preventDefault()
    const existingOutputs = [...this.state.output]

    existingOutputs.push(<h4 key={shortid.generate()}>{this.props.resourceTemplate.resourceLabel}</h4>)

    const newReduxPath = [...this.props.reduxPath]

    /*
     * Replace the generated id so that this is a new resource.
     * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Monograph:Work"
     */
    newReduxPath[newReduxPath.length - 2] = shortid.generate()
    const result = this.populatePropertyTemplates(newReduxPath)

    this.setState({ output: existingOutputs.concat(result) })
  }

  populatePropertyTemplates = (reduxPath) => {
    const newOutput = []

    this.props.resourceTemplate.propertyTemplates.map((property) => {
      const keyId = shortid.generate()

      newOutput.push(<PropertyTemplateOutline
                      propertyTemplate={property}
                      rtId={this.props.resourceTemplate.id}
                      reduxPath={reduxPath}
                      key={keyId} />)
    })

    return newOutput
  }

  render() {
    // repeatable defaults to false, so isAddDisabled defaults to true
    const isAddDisabled = this.props.isRepeatable ? !JSON.parse(this.props.isRepeatable) : true

    return (<div>
      <div className="row" key={shortid.generate()}>
        <section className="col-md-10">
          <h4>{this.props.resourceTemplate.resourceLabel}</h4>
        </section>
        <section className="col-md-2">
          <PropertyActionButtons
            handleAddClick={this.handleAddClick}
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
  resourceTemplate: PropTypes.object,
}

export default PropertyResourceTemplate
