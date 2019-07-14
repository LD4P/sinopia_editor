// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import PropertyActionButtons from './PropertyActionButtons'
import PropertyTemplateOutline from './PropertyTemplateOutline'
import { getResourceTemplate } from 'selectors/resourceSelectors'
import { addResource as addResourceCreator } from 'actionCreators'

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
  handleAddClick = (reduxPath, event) => {
    event.preventDefault()
    this.props.addResource(reduxPath)
  }

  populatePropertyTemplates = () => this.props.resourceTemplate.propertyTemplates.map((property) => {
    /*
     * Add the property uri to the redux path
     * The redux path will be something like ..., "kV5fjX2b1", "resourceTemplate:bf2:Title", "http://schema.org/description"
     */
    const newReduxPath = [...this.props.reduxPath, property.propertyURI]

    return (<PropertyTemplateOutline
                    propertyTemplate={property}
                    rtId={this.props.resourceTemplate.id}
                    reduxPath={newReduxPath}
                    key={shortid.generate()} />)
  })

  render() {
    if (!this.props.resourceTemplate) {
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
            handleAddClick={this.handleAddClick.bind(this, this.props.reduxPath)}
            addButtonDisabled={isAddDisabled}
            reduxPath={this.props.reduxPath}
            key={shortid.generate()} />
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
  isRepeatable: PropTypes.string,
  reduxPath: PropTypes.array,
  resourceTemplate: PropTypes.object,
  addResource: PropTypes.func,
}

const mapStateToProps = (state, ourProps) => {
  const resourceTemplateId = ourProps.reduxPath.slice(-1)[0]
  const resourceTemplate = getResourceTemplate(state, resourceTemplateId)
  return {
    resourceTemplate,
  }
}

const mapDispatchToProps = dispatch => ({
  addResource(reduxPath) {
    dispatch(addResourceCreator(reduxPath))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyResourceTemplate)
