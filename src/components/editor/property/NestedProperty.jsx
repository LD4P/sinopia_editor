// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import NestedPropertyHeader from './NestedPropertyHeader'
import PropertyComponent from './PropertyComponent'
import { selectProperty } from 'selectors/resources'
import { connect } from 'react-redux'

const NestedProperty = (props) => (
  <div className="rtOutline" data-label={props.property.propertyTemplate.label}>
    <NestedPropertyHeader property={ props.property } />
    { props.property.values !== null && props.property.show
        && (
          <div className="rOutline-property">
            <PropertyComponent property={ props.property } />
          </div>
        )
    }
  </div>
)

NestedProperty.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  property: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => ({
  property: selectProperty(state, ourProps.propertyKey),
})

export default connect(mapStateToProps)(NestedProperty)
