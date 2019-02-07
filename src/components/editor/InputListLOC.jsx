// Copyright 2018 Stanford University see Apache2.txt for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'

import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'

class InputListLOC extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
      defaults: []
    }
    this.hasPropertyRemark = this.hasPropertyRemark.bind(this)

    try {
      const defaultValue = this.props.propertyTemplate.valueConstraint.defaults[0]
      const defaults = [{
        id: defaultValue.defaultURI,
        uri: defaultValue.defaultURI,
        label: defaultValue.defaultLiteral
      }]
      this.state.defaults = defaults
      this.setPayLoad(defaults)
    } catch (error) {
      console.log(`defaults not defined in the property template: ${error}`)
    }
  }

  setPayLoad(items) {
    let payload = {
      id: this.props.propertyTemplate.propertyURI,
      items: items,
      rtId: this.props.rtId
    }
    this.props.handleSelectedChange(payload)
  }

  hasPropertyRemark(propertyTemplate) {
    if(propertyTemplate.remark) {
      return <PropertyRemark remark={propertyTemplate.remark}
                             label={propertyTemplate.propertyLabel} />;
    }
    return propertyTemplate.propertyLabel;
  }

  mandatorySuperscript() {
    if (JSON.parse(this.props.propertyTemplate.mandatory)) {
      return <RequiredSuperscript />
    }
  }

  render() {
    let lookupUri, isMandatory, isRepeatable
    try {
      isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
      isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)
      lookupUri = this.props.lookupConfig.value.uri
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
      defaultSelected: this.state.defaults
    }
    var opts = []
    return (
      <div>
        <label htmlFor="targetComponent"
               title={this.props.propertyTemplate.remark}>
          {this.hasPropertyRemark(this.props.propertyTemplate)}
          {this.mandatorySuperscript()}
          <Typeahead
            onFocus={() => {
              this.setState({isLoading: true})
              fetch(`${lookupUri}.json`)
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
            onBlur={() => {this.setState({isLoading: false})}}
            onChange={selected => this.setPayLoad(selected)}
            {...typeaheadProps}
          />
        </label>
      </div>
    )
  }
}

InputListLOC.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    propertyURI: PropTypes.string,
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

export default connect(mapStatetoProps, mapDispatchtoProps)(InputListLOC)