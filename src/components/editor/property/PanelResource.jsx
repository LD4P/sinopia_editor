// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import PanelProperty from './PanelProperty'
import PanelResourceNav from 'components/editor/leftNav/PanelResourceNav'
import { selectCurrentResourceIsReadOnly } from 'selectors/resources'

// Top-level resource
const PanelResource = (props) => {
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))
  const resourceDivClass = readOnly ? 'col-sm-12' : 'col-sm-9'

  return (
    <div className="row" >
      { !readOnly && <PanelResourceNav resource={props.resource} /> }
      <div className={resourceDivClass}>
        <form>
          {
            props.resource.propertyKeys.map((propertyKey, index) => (
              <PanelProperty resourceKey={props.resource.key}
                             propertyKey={propertyKey}
                             key={propertyKey}
                             float={index}
                             id={propertyKey} />
            ))
          }
        </form>
      </div>
    </div>
  )
}

PanelResource.propTypes = {
  resource: PropTypes.object.isRequired,
}

export default PanelResource
