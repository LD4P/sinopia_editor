// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'

class InputLang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: []
    }
  }

  render() {
    var typeaheadProps = {
      id: "langComponent",
      placeholder: "placeholder",
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected
    }
    var opts = []
    return (
      <div>
        <label htmlFor="langComponent">Select langauge for {this.props.textValue}
        <Typeahead
          onFocus={() => {
            this.setState({isLoading: true});
            fetch("https://id.loc.gov/vocabulary/languages.json")
              .then(resp => resp.json())
              .then(json => {
                for(var i in json){
                  try{
                    const item = Object.getOwnPropertyDescriptor(json, i)
                    const uri = item.value["@id"]
                    // It so happens that LC's QA Language list has english in the 2nd place.
                    const label = item.value["http://www.loc.gov/mads/rdf/v1#authoritativeLabel"][1]["@value"]
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
                id: this.props.textValue,
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

// InputList.propTypes = {
//   propertyTemplate: PropTypes.shape({
//     propertyLabel: PropTypes.string,
//     mandatory: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
//     repeatable: PropTypes.oneOfType([ PropTypes.string, PropTypes.bool]),
//     valueConstraint: PropTypes.shape({
//       useValuesFrom: PropTypes.oneOfType([ PropTypes.string, PropTypes.array])
//     })
//   }).isRequired
// }

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

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLang)
