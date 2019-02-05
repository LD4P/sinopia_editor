// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setLang } from '../../actions/index'

class InputLang extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: []
    }
  }

  // TODO:
  // English is the default value, but is not set in the redux.lang.store, so it currently would need to be set manually
  // in the generation of RDF.
  // See https://github.com/LD4P/sinopia_editor/issues/290

  // When clicking Cancel make it not save the language. Clicking X to remove the input for the literal
  // leaves the input in the lang redux store but nothing will be associated with it in the "literal" store.
  // See https://github.com/LD4P/sinopia_editor/issues/275

  setPayLoad(items) {
    let payload = {
        id: this.props.textValue,
        items: items
    }
    this.props.handleSelectedChange(payload)
  }

  render() {
    var typeaheadProps = {
      id: "langComponent",
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

                    let valArr = item.value["http://www.loc.gov/mads/rdf/v1#authoritativeLabel"]
                    var label;
                    valArr.forEach(function(obj){
                      if (obj["@language"] == "en"){
                        label = obj["@value"]
                      }
                    })
                    
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
          onChange={selected => this.setPayLoad(selected)}
          {...typeaheadProps}
        />
        </label>
      </div>
    )
  }
}

InputLang.propTypes = {
    textValue: PropTypes.string.isRequired
}

const mapStatetoProps = (state) => {
  let data = state.lang.formData
  let result = {}
  if (data !== undefined){
    result = { formData: data }
  }
  return result
}

const mapDispatchtoProps = dispatch => ({
  handleSelectedChange(selected){
    dispatch(setLang(selected))
  }
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLang)
