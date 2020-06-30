// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import shortid from 'shortid'
import PropTypes from 'prop-types'
import { getLookupResults } from 'sinopiaSearch'
import ResourceList from './ResourceList'
import InputLookup from './InputLookup'

const InputLookupSinopia = (props) => {
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
      if (result.error) {
        options.push({
          isError: true,
          label: result.error,
          id: shortid.generate(),
        })
        return
      }
      result.results.forEach((option) => {
        options.push(option)
      })
    })
    return options
  }

  return (
    <React.Fragment>
      <InputLookup getLookupResults={getLookupResults} getOptions={getOptions} propertyKey={props.propertyKey} />
      <ResourceList propertyKey={props.propertyKey} />
    </React.Fragment>
  )
}

InputLookupSinopia.propTypes = {
  propertyKey: PropTypes.string.isRequired,
}

export default InputLookupSinopia
