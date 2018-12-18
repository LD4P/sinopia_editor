// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'

class
  InputList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: []
    }
  }

  render() {
    let list_url, isMandatory, isRepeatable
    try {
      list_url = this.props.propertyTemplate.valueConstraint.useValuesFrom[0]
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
      selected: this.state.selected
    }
    var opts = []
    return (
      <div>
        <label htmlFor="targetComponent">{this.props.propertyTemplate.propertyLabel}
        <Typeahead
          onFocus={() => {
            this.setState({isLoading: true});
            fetch(`${list_url}.json`)
              .then(resp => resp.json())
              .then(json => {
                for(var i in json){
                  try{
                    const item = Object.getOwnPropertyDescriptor(json, i)
                    const uri = item.value["@id"]
                    const label = item.value["http://www.loc.gov/mads/rdf/v1#authoritativeLabel"][0]["@value"]
                    opts.push({ id: uri, uri: uri, label: label })
                  } catch (error) {
                    //ignore
                  }
                }
              })
              .then(() => this.setState({
                  isLoading: false,
                  options: opts
              }))
              .catch(() => {return false})
          }}
          onBlur={() => {
            this.setState({isLoading: false});
          }}
          onChange={selected => {
            let payload = {
                id: this.props.propertyTemplate.propertyLabel,
                items: selected
              }
              this.props.handleSelectedChange(payload)
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

const mapStatetoProps = (state) => {
  let data = state.lookups.formData
  let result = {}
  if (data !== undefined){
    result = { formData: data }
  }
  return result
}

const mapDispatchtoProps = dispatch => ({
  handleSelectedChange(selected){
    dispatch(changeSelections(selected))
  }
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputList)
