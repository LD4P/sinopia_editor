// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import shortid from 'shortid'
import { getSearchResults } from 'utilities/QuestioningAuthority'
import InputLookup from './InputLookup'

const InputLookupQA = (props) => {
  const getOptions = (results) => {
    const options = []
    results.forEach((result) => {
      const authLabel = result.authLabel
      const authURI = result.authURI
      options.push({
        authURI,
        authLabel,
        label: authLabel,
      })
      if (result.isError) {
        options.push({
          isError: true,
          label: result.errorObject.message,
          id: shortid.generate(),
        })
        return
      }
      result.body.results.forEach((option) => {
        options.push(option)
      })
    })
    return options
  }

  return (
    <InputLookup getLookupResults={getSearchResults} getOptions={getOptions} property={props.property} />
  )
}

InputLookupQA.propTypes = {
  property: PropTypes.object.isRequired,
}

export default InputLookupQA
