// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { getLookupResults } from 'sinopiaSearch'
import { getSinopiaOptions } from 'utilities/Search'

import ResourceList from './ResourceList'
import InputLookup from './InputLookup'

const InputLookupSinopia = (props) => (
  <React.Fragment>
    <InputLookup
      getLookupResults={getLookupResults}
      getOptions={getSinopiaOptions}
      property={props.property}
      propertyTemplate={props.propertyTemplate} />
    <ResourceList property={props.property} />
  </React.Fragment>
)


InputLookupSinopia.propTypes = {
  property: PropTypes.object.isRequired,
  propertyTemplate: PropTypes.object.isRequired,
}

export default InputLookupSinopia
