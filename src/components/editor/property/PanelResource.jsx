// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PanelProperty from './PanelProperty'
import PanelResourceNav from './PanelResourceNav'

// Top-level resource
const PanelResource = (props) => (
  <div className="row" >
    <PanelResourceNav resourceKey={props.resource.key} />
    <div className="col-sm-9">
      <form>
        {
          props.resource.properties.map((property, index) => (
            <PanelProperty propertyKey={property.key} key={property.key} float={index} id={property.key} />
          ))
        }
      </form>
    </div>
  </div>
)

PanelResource.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResource
