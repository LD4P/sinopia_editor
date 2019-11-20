// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { getResourceTemplate, findNode } from 'selectors/resourceSelectors'
import _ from 'lodash'

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
  populatePropertyTemplates = () => this.props.resourceTemplate.propertyTemplates.map((property) => {
    /*
     * Add the property uri to the redux path
     * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Title", "http://schema.org/description"
     */
    const newReduxPath = [...this.props.reduxPath, property.propertyURI]

    return (<PropertyTemplateOutline reduxPath={newReduxPath} key={newReduxPath.join()} />)
  })

  render() {
    if (!this.props.resourceTemplate) {
      return null
    }
    // repeatable defaults to false, so isNotRepeatable defaults to true
    const isNotRepeatable = this.props.isRepeatable ? !JSON.parse(this.props.isRepeatable) : true
    const isAddHidden = isNotRepeatable || this.props.index > 0
    const isRemoveHidden = this.props.siblingResourceCount === 1
    return (<div>
      <div className="row" key={this.props.reduxPath.join()}>
        <section className="col-md-6">
          <h5>{this.props.resourceTemplate.resourceLabel}</h5>
        </section>
        <section className="col-md-6">
          <PropertyActionButtons
            addButtonHidden={isAddHidden}
            removeButtonHidden={isRemoveHidden}
            reduxPath={this.props.reduxPath}
            key={this.props.reduxPath.join()} />
        </section>
      </div>
      <div>
        { this.populatePropertyTemplates() }
      </div>
    </div>
    )
  }
}

PropertyResourceTemplate.propTypes = {
  index: PropTypes.number,
  isRepeatable: PropTypes.string,
  reduxPath: PropTypes.array,
  resourceTemplate: PropTypes.object,
  siblingResourceCount: PropTypes.number,
}

const mapStateToProps = (state, ourProps) => {
  const resourceTemplateId = ourProps.reduxPath.slice(-1)[0]
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  const parentPropertyReduxPath = ourProps.reduxPath.slice(0, ourProps.reduxPath.length - 2)
  const parentPropertyNode = findNode(state, parentPropertyReduxPath)
  const siblingResourceCount = Object.keys(parentPropertyNode).reduce((count, key) => {
    if (_.first(Object.keys(parentPropertyNode[key])) === resourceTemplateId) {
      return count + 1
    }
    return count
  }, 0)
  return {
    resourceTemplate,
    siblingResourceCount,
  }
}

export default connect(mapStateToProps, null)(PropertyResourceTemplate)
