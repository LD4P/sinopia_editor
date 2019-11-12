// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import OutlineHeader from './OutlineHeader'
import { isResourceWithValueTemplateRef, resourceToName } from 'Utilities'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import PropertyComponent from './PropertyComponent'
import ResourceProperty from './ResourceProperty'
import { isExpanded, getPropertyTemplate } from 'selectors/resourceSelectors'

const PropertyTemplateOutline = (props) => {
  let classNames = 'rOutline-property'
  if (props.collapsed) { classNames += ' collapse' }

  let propertyRows = null
  if (!props.collapsed) {
    if (isResourceWithValueTemplateRef(props.property)) {
      const isAddHidden = !booleanPropertyFromTemplate(props.property, 'repeatable', false)
      propertyRows = (<ResourceProperty key={props.reduxPath.join()}
                                        propertyTemplate={props.property}
                                        reduxPath={props.reduxPath}
                                        addButtonHidden={isAddHidden} />)
    } else {
      propertyRows = (<PropertyComponent key={props.reduxPath.join()} propertyTemplate={props.property} reduxPath={props.reduxPath} />)
    }
  }

  return (
    <div className="rtOutline" data-label={props.property.propertyLabel}>
      <OutlineHeader reduxPath={props.reduxPath}
                     id={resourceToName(props.property.propertyURI)}
                     key={props.reduxPath.join()} />
      <div className={classNames}>
        {propertyRows}
      </div>
    </div>
  )
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
