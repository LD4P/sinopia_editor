// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { getResourceTemplate } from 'selectors/resourceSelectors'


/**
 * Renders a sub-resource template (e.g. WorkTitle, WorkVariantTitle, TranscribedTitle)
 * In Redux these are modeled like this:
 *   http://id.loc.gov/ontologies/bibframe/title: {
 *     'AE6Be-DJGj': {
 *       'resourceTemplate:bf2:WorkTitle': {
 *         'http://id.loc.gov/ontologies/bibframe/mainTitle: {
 *
 *         }
 *       }
 *     }
 *     'Mxt-oGAg0s2': {
 *       'resourceTemplate:bf2:WorkVariantTitle': {
 *         'http://id.loc.gov/ontologies/bibframe/mainTitle: {
 *
 *         }
 *       }
 *     }
 *     'dGMYKnhJhlG': {
 *       'resourceTemplate:bf2:TranscribedTitle': {
 *         'http://id.loc.gov/ontologies/bibframe/mainTitle: {
 *
 *         }
 *       }
 *     }
 *   }
 *
 *  In the props we are passed the resourceTemplate, so we can get the rows from
 *  the redux store by filtering path for items that have a key that matches
 *  resourceTemplate.id
 */
class PropertyResourceTemplate extends Component {
  constructor(props) {
    super(props)
    this.state = {
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
    // const keyId = shortid.generate()

    return this.props.resourceTemplate.propertyTemplates.map((property) => {
      /*
       * Add the generated id so that this is a new resource.
       * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Monograph:Work"
       */
      const newReduxPath = [...this.props.reduxPath, property.propertyURI]

      return (<PropertyTemplateOutline
                      propertyTemplate={property}
                      rtId={this.props.resourceTemplate.id}
                      reduxPath={newReduxPath}
                      key={shortid.generate()} />)
    })
  }

  render() {
    if (! this.props.resourceTemplate) {
      return null
    }
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

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const resourceTemplateId = reduxPath.pop()
  const key = reduxPath.pop()
  const propertyURI = reduxPath.pop()
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  return {
    resourceTemplate,
  }
}

export default connect(mapStateToProps, null)(PropertyResourceTemplate)
