// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import NestedPropertyHeader from './NestedPropertyHeader'
import PropertyComponent from './PropertyComponent'
import { selectProperty } from 'selectors/resources'
import { connect } from 'react-redux'
import useNavigableComponent from 'hooks/useNavigableComponent'

const NestedProperty = (props) => {
  const [navEl, navClickHandler] = useNavigableComponent(props.property.resourceKey, props.property.key)

  // onClick is to support left navigation, so ignoring jsx-ally seems reasonable.
  /* eslint-disable jsx-a11y/click-events-have-key-events */
  /* eslint-disable jsx-a11y/no-static-element-interactions */
  return (
    <div ref={navEl} onClick={navClickHandler} className="rtOutline" data-label={props.property.propertyTemplate.label}>
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
}

NestedProperty.propTypes = {
  propertyKey: PropTypes.string.isRequired,
  property: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => ({
  property: selectProperty(state, ourProps.propertyKey),
})

export default connect(mapStateToProps)(NestedProperty)
