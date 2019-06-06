// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { templateBoolean } from '../../../Utilities'

class PropertyResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
      collapse: false,
      output: this.populatePropertyTemplates(),
    }
  }

  handleAddClick = (event) => {
    event.preventDefault()
    const existingOutputs = [...this.state.output]

    existingOutputs.push(<h4 key={shortid.generate()}>{this.props.resourceTemplate.resourceLabel}</h4>)
    const result = this.populatePropertyTemplates()

    this.setState({ output: existingOutputs.concat(result) })
  }

  populatePropertyTemplates = () => {
    const newOutput = []

    this.props.resourceTemplate.propertyTemplates.map((property) => {
      const keyId = shortid.generate()

      newOutput.push(<PropertyTemplateOutline
                      propertyTemplate={property}
                      rtId={this.props.resourceTemplate.id}
                      reduxPath={this.props.reduxPath}
                      key={keyId} />)
    })

    return newOutput
  }

  render() {
    const isAddDisabled = !templateBoolean(this.props.isRepeatable)


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
