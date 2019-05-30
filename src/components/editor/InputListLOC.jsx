// Copyright 2018 Stanford University see LICENSE for license

import React, { Component } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import PropertyRemark from './PropertyRemark'
import { connect } from 'react-redux'
import { changeSelections  } from '../../actions/index'
import { defaultValuesFromPropertyTemplate, booleanPropertyFromTemplate } from '../../Utilities'
import shortid from 'shortid'

class InputListLOC extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      options: [],
      defaults: defaultValuesFromPropertyTemplate(this.props.propertyTemplate)
    }

    if (this.state.defaults.length > 0) {
      this.setPayLoad(this.state.defaults)
    } else {
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
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

  hasPropertyRemark = (propertyTemplate) => {
    if(propertyTemplate.remark) {
      return <PropertyRemark remark={propertyTemplate.remark}
                             label={propertyTemplate.propertyLabel} />;
    }
    return propertyTemplate.propertyLabel;
  }

  render() {
    if (this.props.lookupConfig?.uri === undefined) {
      alert(`There is no configured list lookup for ${this.props.propertyTemplate.propertyURI}`)
    }

    const isMandatory = booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
    const isRepeatable = booleanPropertyFromTemplate(this.props.propertyTemplate.valueConstraint, 'repeatable', true)

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
            fetch(`${this.props.lookupConfig.uri}.json`)
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

const mapStateToProps = (state, props) => {
  return Object.assign({}, state)
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected){
    dispatch(changeSelections(selected))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(InputListLOC)
