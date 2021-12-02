// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import { Typeahead, withAsync } from "react-bootstrap-typeahead"
import { getTemplateSearchResults } from "sinopiaSearch"

const AsyncTypeahead = withAsync(Typeahead)

const InputTemplate = ({
  setTemplateId,
  defaultTemplateId = null,
  ...props
}) => {
  const [isLoading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [selected, setSelected] = useState([])

  const search = useCallback((query) => {
    setLoading(true)
    return getTemplateSearchResults(query).then((searchResults) => {
      const newOptions = searchResults.results.map((result) => ({
        label: `${result.resourceLabel} (${result.id})`,
        id: result.id,
      }))
      setOptions(newOptions)
      setLoading(false)
      return newOptions
    })
  }, [])

  useEffect(() => {
    if (defaultTemplateId) {
      search(defaultTemplateId).then((options) => {
        setSelected(options)
      })
    }
  }, [defaultTemplateId, search])

  const change = (newSelected) => {
    setSelected(newSelected)
    if (newSelected.length === 1) {
      setTemplateId(newSelected[0].id)
    }
  }

  return (
    <AsyncTypeahead
      onSearch={search}
      onChange={change}
      options={options}
      multiple={false}
      isLoading={isLoading}
      selected={selected}
      placeholder="Enter id, label, URI, remark, or author"
      minLength={1}
      allowNew={() => false}
      {...props}
    />
  )
}

InputTemplate.propTypes = {
  setTemplateId: PropTypes.func.isRequired,
  defaultTemplateId: PropTypes.string,
}

export default InputTemplate
