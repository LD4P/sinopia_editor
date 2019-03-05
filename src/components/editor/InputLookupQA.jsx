// Copyright 2018 Stanford University see Apache2.txt for license
import React, { Component } from 'react'
import { asyncContainer, Typeahead, Menu, MenuItem } from 'react-bootstrap-typeahead'
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
      isLoading: false,
      options:[],
      optionsByAuth: {}
    }
  }

  componentDidUpdate(prevProps, prevState) {
   console.log("component did update");
   console.log(prevProps);
   console.log(prevState);
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

    const typeaheadProps = {
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      delay: 3000 //changed from 300
    }



    return (
      <div>
          <div id="mytestid">State: {JSON.stringify(this.state.options)}</div>
        <label htmlFor="lookupComponent"
               title={this.props.propertyTemplate.remark}>
        {this.hasPropertyRemark()}
        {this.mandatorySuperscript()}
        <AsyncTypeahead id="lookupComponent"
          onSearch={query => {
              console.log("menu props");
                          console.log(this.menuProps);

            /**When done outside like this, this does concatenate results adding to state */
            /*
               this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat([{"id":"d","uri":"u","label":"q" + query}])
                        }
                    ));
                                   this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat([{"id":"d","uri":"u","label":"q" + query}])
                        }
                    ));
                    */
            //console.log("Before we begin, what are state options");
            //console.log(this.state.options);
            
            Swagger({ url: "src/lib/apidoc.json" }).then((client) => {
              client
                .apis
                .SearchQuery
                .GET_searchAuthority({
                  q: query,
                  vocab: authority,
                  subauthority: subauthority,
                  maxRecords: 1,
                  lang: language
                })
                .then(response => {
                       this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat(response.body),
                            optionsByAuth:Object.assign({}, state.optionsByAuth, {authority:state.options})
                        }
                    ));

                   
                }
              )
            }).catch(() => { return false })           
            //Second Swagger call
            
            console.log("Before the second swagger call");
            Swagger({ url: "src/lib/apidoc.json" }).then((client) => {
              client
                .apis
                .SearchQuery
                .GET_searchAuthority({
                  q: "dustin",
                  vocab: authority,
                  subauthority: subauthority,
                  maxRecords: 1,
                  lang: language
                })
                .then(response => {
                        this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat(response.body)
                        }
                    ));
                    
                }
              )
            }).catch(() => { return false })
            
                 this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat(state.options)
                        }
                    ));
                    console.log("concat options");

                                     this.setState((state) => (
                        {
                            isLoading: false,
                            options: state.options.concat(state.options)
                        }
                    ));
            
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

           renderMenu={(results, menuProps) => (
           

           <Menu {...menuProps}>
            {results.map((result, index) => (
                <MenuItem key={index} option={result} position={index}>
                    {result.label}
                </MenuItem>
            ))}
            </Menu>
        )}

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
