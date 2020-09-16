// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import InputLookupModal from './InputLookupModal'

const InputLookup = (props) => (
  <InputLookupModal property={props.property} getLookupResults={props.getLookupResults} getOptions={props.getOptions} />
)

InputLookup.propTypes = {
  property: PropTypes.object.isRequired,
  getLookupResults: PropTypes.func.isRequired,
  getOptions: PropTypes.func.isRequired,
}

export default InputLookup
