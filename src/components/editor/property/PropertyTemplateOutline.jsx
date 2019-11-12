// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import OutlineHeader from './OutlineHeader'
import { isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'
import { isExpanded, getPropertyTemplate } from 'selectors/resourceSelectors'

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
      const isAddHidden = !booleanPropertyFromTemplate(this.props.property, 'repeatable', false)
      return (<ResourceProperty key={this.props.reduxPath.join()}
                                propertyTemplate={this.props.property}
                                reduxPath={this.props.reduxPath}
                                addButtonHidden={isAddHidden} />)
    }

    return (<PropertyComponent key={this.props.reduxPath.join()} propertyTemplate={this.props.property} reduxPath={this.props.reduxPath} />)
  }

  render() {
    return (
      <div className="rtOutline" data-label={this.props.property.propertyLabel}>
        <OutlineHeader reduxPath={this.props.reduxPath}
                       id={resourceToName(this.props.property.propertyURI)}
                       key={this.props.reduxPath.join()} />
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
  collapsed: PropTypes.bool,
}

const mapStateToProps = (state, ourProps) => {
  const reduxPath = [...ourProps.reduxPath]
  const propertyURI = reduxPath.pop()
  const resourceTemplateId = reduxPath.pop()
  const property = getPropertyTemplate(state, resourceTemplateId, propertyURI)

  return {
    property,
    collapsed: !isExpanded(state, ourProps.reduxPath),
  }
}

export default connect(mapStateToProps, null)(PropertyTemplateOutline)
