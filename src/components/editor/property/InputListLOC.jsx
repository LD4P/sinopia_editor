// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { changeSelections } from 'actions/index'
import { getDisplayValidations } from 'reducers/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate } from 'Utilities'

class InputListLOC extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [], // The suggestions returned from QA
      defaults: defaultValuesFromPropertyTemplate(this.props.propertyTemplate),
      error: null,
    }
  }

  componentDidMount() {
    this._isMounted = true
    if (this.state.defaults.length > 0) {
      this.selectionChanged(this.state.defaults)
    } else {
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
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
    return booleanPropertyFromTemplate(this.props.propertyTemplate.valueConstraint, 'repeatable', true)
  }

  validate() {
    if (!this.typeahead) {
      return
    }
    const selected = this.typeahead.state.selected

    return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
  }

  render() {
    if (this.props.lookupConfig?.uri === undefined) {
      alert(`There is no configured list lookup for ${this.props.propertyTemplate.propertyURI}`)
    }

    if (this.state.defaults.length === undefined) {
      return (<div />)
    }

    const typeaheadProps = {
      id: 'targetComponent',
      required: this.isMandatory,
      multiple: this.isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      defaultSelected: this.state.defaults,
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
            fetch(`${this.props.lookupConfig.uri}.json`)
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
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    propertyURI: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }).isRequired,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state) => {
  const displayValidations = getDisplayValidations(state)

  return { displayValidations }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    if (this._isMounted) {
      dispatch(changeSelections(selected))
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
