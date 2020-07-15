// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PanelProperty from './PanelProperty'

// Top-level resource
const PanelResource = (props) => (
  <div>
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="row" id="ResourceTemplateForm">
        {
          props.resource.properties.map((property, index) => (
            <PanelProperty propertyKey={property.key} key={property.key} float={index} id={property.key} />
          ))
        }
      </div>
    </form>
  </div>
)

PanelResource.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResource
