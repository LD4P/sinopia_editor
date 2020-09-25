// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import PanelProperty from './PanelProperty'
import PanelResourceNav from './PanelResourceNav'

// Top-level resource
const PanelResource = (props) => (
  <div className="row" >
    <PanelResourceNav resource={props.resource} />
    <div className="col-sm-9">
      <form>
        {
          props.resource.propertyKeys.map((propertyKey, index) => (
            <PanelProperty resourceKey={props.resource.key} propertyKey={propertyKey} key={propertyKey} float={index} id={propertyKey} />
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
