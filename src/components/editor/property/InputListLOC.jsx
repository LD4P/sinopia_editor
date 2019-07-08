// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { changeSelections } from 'actions/index'
import { itemsForProperty, getDisplayValidations, getPropertyTemplate } from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate, getLookupConfigItems } from 'Utilities'

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

  validate() {
    if (!this.typeahead) {
      return
    }
    const selected = this.typeahead.state.selected

    return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
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
    const opts = []
    let groupClasses = 'form-group'
    const error = this.validate()

    if (error) {
      groupClasses += ' has-error'
    }

    return (
      <div className={groupClasses}>
        <Typeahead
          ref={typeahead => this.typeahead = typeahead}
          onFocus={() => {
            this.setState({ isLoading: true })
            fetch(`${this.props.lookupConfig[0].uri}.json`)
              .then(resp => resp.json())
              .then((json) => {
                for (const i in json) {
                  try {
                    const newId = shortid.generate()
                    const item = Object.getOwnPropertyDescriptor(json, i)
                    const uri = item.value['@id']
                    const label = item.value['http://www.loc.gov/mads/rdf/v1#authoritativeLabel'][0]['@value']

                    opts.push({ id: newId, label, uri })
                  } catch (err) {
                    // Ignore
                  }
                }
              })
              .then(() => this.setState({
                isLoading: false,
                options: opts,
              }))
              .catch(() => false)
          }}
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
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    propertyURI: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }),
  reduxPath: PropTypes.array,
  selected: PropTypes.object,
}

const mapStateToProps = (state, ownProps) => {
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const lookupConfig = getLookupConfigItems(propertyTemplate)

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
    propertyTemplate,
    displayValidations,
    lookupConfig,
  }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
