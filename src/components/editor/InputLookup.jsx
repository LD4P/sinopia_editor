// Copyright 2018 Stanford University see Apache2.txt for license
import React, {Component} from 'react'
import {asyncContainer, Typeahead} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true
    }
  }

  render() {
    const lookup_url = this.props.propertyTemplate.valueConstraint.useValuesFrom[0]
    const isRequired = JSON.parse(this.props.propertyTemplate.mandatory)
    const isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)

    return (
      <div>
        <label htmlFor="lookupComponent">{this.props.propertyTemplate.propertyLabel}
        <AsyncTypeahead
          id="lookupComponent"
          required={isRequired}
          multiple={isRepeatable}
          placeholder={this.props.propertyTemplate.propertyLabel}
          useCache={true}
          isLoading={this.state.isLoading}
          onSearch={query => {
            this.setState({isLoading: true});
            //TODO: this fetch function will be replaced with a swagger API call function (#197):
            fetch(`${lookup_url}?q=${query}&maxRecords=6`)
              .then(resp => resp.json())
              .then(json => this.setState({
                isLoading: false,
                options: json
              }))
          }}
          onChange={selected => {
            this.setState({selected})
            }
          }
          options={this.state.options}
          selected={this.state.selected}
        />
        </label>
      </div>
    )
  }
}

InputLookup.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
    })
  }).isRequired
}

export default InputLookup
