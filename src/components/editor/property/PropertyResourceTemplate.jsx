// Copyright 2019 Stanford University see LICENSE for license

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'
import PropTypes from 'prop-types'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'

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
  populatePropertyTemplates(keyId) {
    return this.props.resourceTemplate.propertyTemplates.map((property) => {
      /*
       * Add the generated id so that this is a new resource.
       * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Monograph:Work"
       */
      const reduxPath = [...this.props.reduxPath, keyId, this.props.resourceTemplate.id]

      return (<PropertyTemplateOutline
                      propertyTemplate={property}
                      rtId={this.props.resourceTemplate.id}
                      reduxPath={reduxPath}
                      key={keyId + property.propertyURI} />)
    })
  }

  firstHeader() {
    const isAddDisabled = this.props.isRepeatable ? !JSON.parse(this.props.isRepeatable) : true
    return (
      <div className="row">
        <section className="col-md-10">
          <h4>{this.props.resourceTemplate.resourceLabel}</h4>
        </section>
        <section className="col-md-2">
          <PropertyActionButtons
            addButtonDisabled={isAddDisabled}
            reduxPath={this.props.reduxPath}
            resourceTemplateId={this.props.resourceTemplate.id} />
        </section>
      </div>
    )
  }

  secondHeader() {
    return (
      <div className="row">
        <section className="col-md-12">
          <h4>{this.props.resourceTemplate.resourceLabel}</h4>
        </section>
      </div>
    )
  }

  render() {
    // repeatable defaults to false, so isAddDisabled defaults to true
    return this.props.models.map((identifier, index) => {
      const header = index === 0 ? this.firstHeader() : this.secondHeader()
      return (<Fragment key={identifier}>{header}{this.populatePropertyTemplates(identifier)}</Fragment>)
    })
  }
}

PropertyResourceTemplate.propTypes = {
  isRepeatable: PropTypes.string,
  reduxPath: PropTypes.array,
  resourceTemplate: PropTypes.object,
  models: PropTypes.array,
}

const mapStateToProps = (state, ourProps) => {
  const node = findNode(state.selectorReducer, ourProps.reduxPath)
  const candidates = Object.keys(node)
  const models = candidates.filter(id => Object.keys(node[id])[0] === ourProps.resourceTemplate.id)
  return {
    models,
  }
}

export default connect(mapStateToProps)(PropertyResourceTemplate)
