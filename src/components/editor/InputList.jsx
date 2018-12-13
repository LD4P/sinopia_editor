// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react';
import {Typeahead} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'

class
  InputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
      selected: []
    }
  }

  render() {
    //TODO: change target_url to use live ld4l lookup when it is available (#226)
    let target_url, isMandatory, isRepeatable
    try {
      target_url = this.props.propertyTemplate.valueConstraint.useValuesFrom[0]
      isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
      isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)
    } catch (error) {
      console.log(`Some properties were not defined in the json file: ${error}`)
    }

    var typeaheadProps = {
      id: "targetComponent",
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      labelKey: "label"
    }

    return (
      <div>
        <label htmlFor="targetComponent">{this.props.propertyTemplate.propertyLabel}
        <Typeahead
          onFocus={() => {
            this.setState({isLoading: true});
            fetch(`${target_url}`)
              .then(resp => resp.json())
              .then(json => this.setState({
                isLoading: false,
                options: json
              }))
          }}
          onBlur={() => {
            this.setState({isLoading: false});
          }}
          onChange={selected => {
            this.setState({selected})
            }
          }
          {...typeaheadProps}
        />
        </label>
      </div>
    )
  }
}

InputList.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
    })
  }).isRequired
}

export default InputList