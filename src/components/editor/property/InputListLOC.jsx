// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { changeSelections } from 'actions/index'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'Utilities'
import _ from 'lodash'

// propertyTemplate of type 'lookup' does live QA lookup via API
//  based on URI in propertyTemplate.valueConstraint.useValuesFrom,
//  and the lookupConfig for the URI has component value of 'list'
class InputListLOC extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [], // The suggestions returned from QA
    }
  }

  selectionChanged(items) {
    const payload = {
      id: this.props.propertyTemplate.propertyURI,
      items,
      reduxPath: this.props.reduxPath,
    }

    this.props.handleSelectedChange(payload)
  }

  get isMandatory() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
  }

  get isRepeatable() {
    return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
  }

  responseToOptions(json) {
    const opts = []
    for (const i in json) {
      try {
        const newId = shortid.generate()
        const item = Object.getOwnPropertyDescriptor(json, i)
        const uri = item.value['@id']
        const labels = item.value['http://www.loc.gov/mads/rdf/v1#authoritativeLabel']
        labels.forEach(label => opts.push({ id: newId, label: label['@value'], uri }))
      } catch (err) {
        // Ignore
      }
    }
    return opts
  }

  onFocus() {
    return () => {
      this.setState({ isLoading: true })
      const uri = `${this.props.lookupConfig[0].uri}.json`
      fetch(uri)
        .then(resp => resp.json())
        .then(json => this.responseToOptions(json))
        .then(opts => this.setState({
          isLoading: false,
          options: opts,
        }))
        .catch(() => false)
    }
  }

  render() {
    // Don't render if no property template yet
    if (!this.props.propertyTemplate) {
      return null
    }

    if (this.props.lookupConfig?.length > 1) {
      alert(`There are multiple configured list lookups for ${this.props.propertyTemplate.propertyURI}`)
    }

    if (this.props.lookupConfig[0]?.uri === undefined) {
      alert(`There is no configured list lookup for ${this.props.propertyTemplate.propertyURI}`)
    }

    const typeaheadProps = {
      id: 'targetComponent',
      required: this.isMandatory,
      multiple: this.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      emptyLabel: 'retrieving list of terms...',
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.props.selected,
    }

    let error
    let groupClasses = 'form-group'

    if (this.props.displayValidations && !_.isEmpty(this.props.errors)) {
      groupClasses += ' has-error'
      error = this.props.errors.join(',')
    }

    return (
      <div className={groupClasses}>
        <Typeahead
          ref={typeahead => this.typeahead = typeahead}
          onFocus={this.onFocus()}
          onBlur={() => { this.setState({ isLoading: false }) }}
          onChange={selected => this.selectionChanged(selected)}
          {...typeaheadProps}
        />
        {error && <span className="help-block">{error}</span>}
      </div>
    )
  }
}

InputListLOC.propTypes = {
  defaults: PropTypes.arrayOf(PropTypes.object),
  displayValidations: PropTypes.bool,
  handleSelectedChange: PropTypes.func,
  lookupConfig: PropTypes.arrayOf(PropTypes.object),
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.array,
  selected: PropTypes.arrayOf(PropTypes.object),
  errors: PropTypes.array,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)
  const errors = findErrors(state.selectorReducer, ownProps.reduxPath)
  const selected = itemsForProperty(state.selectorReducer, ownProps.reduxPath)

  return {
    selected,
    propertyTemplate,
    displayValidations,
    lookupConfig,
    errors,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
