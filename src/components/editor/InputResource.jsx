// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

class InputResource extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      options: [],
      selected: []
    }
  }

  render() {
    //TODO: change target_url to use live ld4l lookup when it is available (#226)
    const target_url = this.props.propertyTemplate.valueConstraint.useValuesFrom[0]
    const isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
    const isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)

    return (
      <div>
        <label htmlFor="targetComponent">{this.props.propertyTemplate.propertyLabel}
        <Typeahead
          id="targetComponent"
          required={isMandatory}
          multiple={isRepeatable}
          placeholder={this.props.propertyTemplate.propertyLabel}
          useCache={true}
          selectHintOnEnter={true}
          isLoading={this.state.isLoading}
          options={this.state.options}
          onFocus={() => {
            this.setState({isLoading: true});
            //TODO: this fetch function will be replaced with a swagger API call function (#197):
            fetch(`${target_url}`)
              .then(resp => resp.json())
              .then(json => this.setState({
                isLoading: false,
                options: json
              }))
          }}
          selected={this.state.selected}
          onChange={selected => {
            this.setState({selected})
            }
          }
        />
        </label>
      </div>
    )
  }
}

InputResource.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
    })
  }).isRequired
}

export default InputResource