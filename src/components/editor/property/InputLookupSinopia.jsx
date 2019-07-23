// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead, asyncContainer } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import Config from 'Config'
import { connect } from 'react-redux'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { changeSelections } from 'actions/index'
import { booleanPropertyFromTemplate } from 'Utilities'
import _ from 'lodash'

const AsyncTypeahead = asyncContainer(Typeahead)

const InputLookupSinopia = (props) => {
  // Don't render if no property template yet
  if (!props.propertyTemplate) {
    return null
  }

  const [isLoading, setLoading] = useState(false)
  const [options, setOptions] = useState([])
  const isMandatory = booleanPropertyFromTemplate(props.propertyTemplate, 'mandatory', false)
  const isRepeatable = booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)

  const responseToOptions = json => json
    .hits.hits.map(row => ({ uri: row._source['@id'], label: row._source.label }))

  const search = (query) => {
    setLoading(true)

    const uri = `${Config.searchHost}${Config.searchPath}?q=${query}`
    fetch(uri)
      .then(resp => resp.json())
      .then(json => responseToOptions(json))
      .then((opts) => {
        setOptions(opts)
        setLoading(false)
      })
  }

  const change = (selected) => {
    const payload = {
      uri: props.propertyTemplate.propertyURI,
      items: selected,
      reduxPath: props.reduxPath,
    }

    props.handleSelectedChange(payload)
  }

  let error
  let groupClasses = 'form-group'

  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }

  return (
    <div className={groupClasses}>
      <AsyncTypeahead onSearch={search}
                      onChange={change}
                      options={options}
                      required={isMandatory}
                      multiple={isRepeatable}
                      isLoading={isLoading}
                      placeholder={props.propertyTemplate.propertyLabel}
                      id="sinopia-lookup"
                      filterBy={() => true } />

      {error && <span className="help-block">{error}</span>}
    </div>
  )
}

InputLookupSinopia.propTypes = {
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  selected: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findErrors(state.selectorReducer, ownProps.reduxPath)

  // Make sure that every item has a label
  // This is a temporary strategy until label lookup is implemented.
  const selected = itemsForProperty(state.selectorReducer, ownProps.reduxPath).map((item) => {
    const newItem = { ...item }
    if (newItem.label === undefined) {
      newItem.label = newItem.uri
    }
    return newItem
  })

  return {
    selected,
    reduxPath,
    propertyTemplate,
    displayValidations,
    errors,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupSinopia)
