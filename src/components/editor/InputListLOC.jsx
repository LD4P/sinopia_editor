// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import PropertyRemark from './PropertyRemark'
import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'
import { defaultValuesFromPropertyTemplate } from '../../Utilities'
import shortid from 'shortid'

class InputListLOC extends Component {
  constructor(props) {
    super(props)

    this.hasPropertyRemark = this.hasPropertyRemark.bind(this)

    const defaults = defaultValuesFromPropertyTemplate(this.props.propertyTemplate)

    if (defaults.length > 0) {
      this.setPayLoad(defaults)
    } else {
      console.error(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
    }

    this.state = {
      isLoading: false,
      options: [],
      defaults: defaults
    }
  }

  setPayLoad(items) {
    let payload = {
      id: this.props.propertyTemplate.propertyURI,
      items: items,
      reduxPath: this.props.reduxPath
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

  render() {
    let lookupUri, isMandatory, isRepeatable
    try {
      isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
      isRepeatable = JSON.parse(this.props.propertyTemplate.valueConstraint.repeatable)
      lookupUri = this.props.lookupConfig.uri
    } catch (error) {
      console.error(`Some properties were not defined in the json file: ${error}`)
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
        <Typeahead
          onFocus={() => {
            this.setState({isLoading: true})
            fetch(`${lookupUri}.json`)
              .then(resp => resp.json())
              .then(json => {
                for(var i in json){
                  try{
                    const newId = shortid.generate()
                    const item = Object.getOwnPropertyDescriptor(json, i)
                    const uri = item.value["@id"]
                    const label = item.value["http://www.loc.gov/mads/rdf/v1#authoritativeLabel"][0]["@value"]
                    opts.push({ id: newId, label: label, uri: uri })
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
  return Object.assign({}, state)
}

const mapDispatchtoProps = dispatch => ({
  handleSelectedChange(selected){
    dispatch(changeSelections(selected))
  }
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputListLOC)
