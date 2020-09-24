// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { getSearchResults } from 'utilities/QuestioningAuthority'
import { getQAOptions } from 'utilities/Search'
import InputLookup from './InputLookup'

const InputLookupQA = (props) => (
  <InputLookup getLookupResults={getSearchResults} getOptions={getQAOptions} property={props.property} />
)


InputLookupQA.propTypes = {
  property: PropTypes.object.isRequired,
}

export default InputLookupQA
