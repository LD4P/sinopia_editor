// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { changeSelections } from '../../../actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate } from '../../../Utilities'

class InputListLOC extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
      defaults: defaultValuesFromPropertyTemplate(this.props.propertyTemplate),
    }
  }

  componentDidMount() {
    this._isMounted = true
    if (this.state.defaults.length > 0) {
      this.setPayLoad(this.state.defaults)
    } else {
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
    }
  }

  componentWillUnmount() {
    this._isMounted = false
  }

  setPayLoad(items) {
    const payload = {
      id: this.props.propertyTemplate.propertyURI,
      items,
      reduxPath: this.props.reduxPath,
    }

    this.props.handleSelectedChange(payload)
  }

  render() {
    if (this.props.lookupConfig?.uri === undefined) {
      alert(`There is no configured list lookup for ${this.props.propertyTemplate.propertyURI}`)
    }

    const isMandatory = booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
    const isRepeatable = booleanPropertyFromTemplate(this.props.propertyTemplate.valueConstraint, 'repeatable', true)

    const typeaheadProps = {
      id: 'targetComponent',
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      defaultSelected: this.state.defaults,
    }
    const opts = []


    return (
      <div>
        <Typeahead
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
                  } catch (error) {
                    // ignore
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
          onChange={selected => this.setPayLoad(selected)}
          {...typeaheadProps}
        />
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
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    if (this._isMounted) {
      dispatch(changeSelections(selected))
    }
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
