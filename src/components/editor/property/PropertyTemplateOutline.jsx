// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import OutlineHeader from './OutlineHeader'
import { booleanPropertyFromTemplate, isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'
import { findNode, isExpanded, getPropertyTemplate } from 'selectors/resourceSelectors'

class PropertyTemplateOutline extends Component {
  outlineRowClass = () => {
    let classNames = 'rOutline-property'

    if (this.props.collapsed) { classNames += ' collapse' }

    return classNames
  }

  renderPropertyRows = () => {
    if (this.props.collapsed) {
      return
    }

    if (isResourceWithValueTemplateRef(this.props.property)) {
      const isAddDisabled = !booleanPropertyFromTemplate(this.props.property, 'repeatable', false)
      return (<ResourceProperty key={shortid.generate()}
                                propertyTemplate={this.props.property}
                                reduxPath={this.props.reduxPath}
                                addButtonDisabled={isAddDisabled} />)
    }

    return (<PropertyComponent key={shortid.generate()} propertyTemplate={this.props.property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    return (
      <div className="rtOutline" data-label={this.props.property.propertyLabel}>
        <OutlineHeader reduxPath={this.props.reduxPath}
                       id={resourceToName(this.props.property.propertyURI)}
                       key={shortid.generate()} />
        <div className={this.outlineRowClass()}>
          {this.renderPropertyRows()}
        </div>
      </div>
    )
  }
}

PropertyTemplateOutline.propTypes = {
  reduxPath: PropTypes.array,
  property: PropTypes.object.isRequired,
  resourceModel: PropTypes.object,
  collapsed: PropTypes.bool,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const propertyURI = reduxPath.pop()
  const resourceTemplateId = reduxPath.pop()
  const property = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const resourceModel = findNode(state.selectorReducer, ourProps.reduxPath)

  return {
    resourceModel,
    property,
    collapsed: !isExpanded(state.selectorReducer, ourProps.reduxPath),
  }
}

export default connect(mapStateToProps, null)(PropertyTemplateOutline)
