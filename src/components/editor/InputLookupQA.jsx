// Copyright 2018 Stanford University see Apache2.txt for license
import React, { Component } from 'react'
import { asyncContainer, Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'
import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQA extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false
    }
  }

  hasPropertyRemark = () => {
    if(this.props.propertyTemplate.remark) {
      return <PropertyRemark remark={this.props.propertyTemplate.remark}
          label={this.props.propertyTemplate.propertyLabel} />;
    }
    return this.props.propertyTemplate.propertyLabel;
  }

  mandatorySuperscript = () => {
    if (JSON.parse(this.props.propertyTemplate.mandatory)) {
      return <RequiredSuperscript />
    }
  }

  render() {
    let isMandatory, isRepeatable, authority, subauthority, language
    try {
      isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
      isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)
      authority = this.props.lookupConfig.value.authority
      subauthority = this.props.lookupConfig.value.authority
      language = this.props.lookupConfig.value.language
    } catch (error) {
      console.log(`Problem with properties fetched from resource template: ${error}`)
    }
    console.log("What does lookupConfig look like?"); console.log(this.props.lookupConfig);
    const typeaheadProps = {
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: false,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      delay: 3000 // was 300
    }

    return (
      <div>
        <label htmlFor="lookupComponent"
               title={this.props.propertyTemplate.remark}>
        {this.hasPropertyRemark()}
        {this.mandatorySuperscript()}
        <AsyncTypeahead id="lookupComponent"
          onSearch={query => {
            this.setState({isLoading: true});
            Swagger({ url: "src/lib/apidoc.json" }).then((client) => {
              console.log("authority is");
              console.log(authority);console.log(subauthority);
               let clientPromise =  client
                .apis
                .SearchQuery
                .GET_searchAuthority({
                  q: query,
                  vocab: authority,
                  subauthority: subauthority,
                  maxRecords: 5,
                  lang: language
                });
                
                let secondClientPromise =  client
                .apis
                .SearchQuery
                .GET_searchAuthority({
                  q: query,
                  vocab: "LOCGENRES_LD4L_CACHE",
                  subauthority: "LOCGENRES_LD4L_CACHE",
                  maxRecords: 5,
                  lang: language
                });
       		 Promise.all([clientPromise, secondClientPromise]).then(values => {
       		     let responseBody = [];
               		 let valuesLength = values.length;
               		 let i, r;
               		 for(i = 0; i < valuesLength; i++) {
               		 	r = values[i].body;
               		 	responseBody = responseBody.concat(r);
               		 }
               		 console.log("response body is concatenated");
                     console.log(responseBody);
                this.setState({
	                isLoading: false,
	                options: responseBody
	              })
               }
              )
            }).catch(() => { return false })
          }}
          onChange={selected => {
            let payload = {
                id: this.props.propertyTemplate.propertyURI,
                items: selected,
                rtId: this.props.rtId
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

InputLookupQA.propTypes = {
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

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLookupQA)
