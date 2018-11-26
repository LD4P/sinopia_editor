// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

class InputTarget extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
      options: [],
      selected: []
    }
  }

  render() {
    const target_url = './static/spoofedFilesFromServer/fromQA/frequencies.json'

    return (
      <div>
        <label htmlFor="targetComponent">{this.props.propertyTemplate.propertyLabel}
        <Typeahead
          id="targetComponent"
          required={JSON.parse(this.props.propertyTemplate.mandatory)}
          placeholder={this.props.propertyTemplate.propertyLabel}
          multiple={JSON.parse(this.props.propertyTemplate.repeatable)}
          useCache={true}
          selectHintOnEnter={true}
          isLoading={this.state.isLoading}
          options={this.state.options}
          onFocus={() => {
            this.setState({isLoading: true});
            //TODO: this fetch function will be replaced with a swagger API call function:
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

InputTarget.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
    })
  }).isRequired
}

export default InputTarget