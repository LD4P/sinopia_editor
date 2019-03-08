// Copyright 2018 Stanford University see Apache2.txt for license
import React, { Component } from 'react'
import { asyncContainer, Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'
import { connect } from 'react-redux'
import { changeSelections } from '../../actions/index'
import {groupBy} from 'lodash';

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
    
    let isMandatory, isRepeatable, authority, subauthority, language, lookupConfigs, lookupConfig
    const testConfig = this.props.lookupConfig
    
    try {
      isMandatory = JSON.parse(this.props.propertyTemplate.mandatory)
      isRepeatable = JSON.parse(this.props.propertyTemplate.repeatable)
      /***Passing lookupConfig as array of configs and not just one config***/
      lookupConfigs = this.props.lookupConfig
      //lookupConfig = lookupConfigs[0]
      //authority = lookupConfig.value.authority
      //subauthority = lookupConfig.value.authority
      //language = lookupConfig.value.language
    } catch (error) {
      console.log(`Problem with properties fetched from resource template: ${error}`)
    }
    const typeaheadProps = {
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      delay: 300 // was 300
    }

    return (
      <div>
        <label htmlFor="lookupComponent"
               title={this.props.propertyTemplate.remark}>
        {this.hasPropertyRemark()}
        {this.mandatorySuperscript()}
        <AsyncTypeahead id="lookupComponent"
        
         renderMenu={(results, menuProps) => {
         		//Returning results per each promise
         		const items = [];
         		let r, i, authLabel, resultsLength, authURI, headerKey;
         		resultsLength = results.length;
         		let idx = 0;
         		for(i = 0; i < resultsLength; i++) {
               		r = results[i].body;
               		authLabel = results[i].authLabel;
               		authURI = results[i].authURI;
               		headerKey = authURI + "-header";
               		console.log(authLabel + "=" + authURI);
               		items.push(  <Menu.Header key={headerKey}>
			            {authLabel}
			          </Menu.Header>);
			        //For this authority, display results
			        r.forEach(function(result) {
			        	items.push( <MenuItem option={result} position={idx} key={idx}>
    			          {result.label}
    			        </MenuItem>);
    			        idx++;
			        });
               	}
         		
	         return (
			    <Menu {...menuProps}>
			     {items}
			    </Menu>
			  )
		  	}
		  }
        
        
          onSearch={query => {
            this.setState({isLoading: true});
            Swagger({ url: "src/lib/apidoc.json" }).then((client) => {
              //create array of promises based on the lookup config array that is sent in
              let lookupPromises = lookupConfigs.map(lookupConfig => {
              	authority = lookupConfig.value.authority;
      			subauthority = lookupConfig.value.authority;
      			language = lookupConfig.value.language;
      			//return the 'promise' 
      			return client
	                .apis
	                .SearchQuery
	                .GET_searchAuthority({
	                  q: query,
	                  vocab: authority,
	                  subauthority: subauthority,
	                  maxRecords: 8,
	                  lang: language
	                });
              });
              
             Promise.all(lookupPromises).then((values) => {
                
               		 let valuesLength = values.length;
               		 let i;
               		 for(i = 0; i < valuesLength; i++) {
						values[i]["authLabel"]=testConfig[i].value.label;
               		 	values[i]["authURI"]=testConfig[i].value.uri;
               		 }
               		
                this.setState({
	                isLoading: false,
	                options:values
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

			filterBy={(option, props) => {
				/** Currently don't want any default filtering as we want all the results returned from QA, also we are passing in a complex object **/
    			/* Your own filtering code goes here. */
    			return true;
  			}}
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
