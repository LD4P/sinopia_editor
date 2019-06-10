// Copyright 2018 Stanford University see LICENSE for license
import React, { Component } from 'react'
import {
  Menu, MenuItem, Typeahead, asyncContainer,
} from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import Swagger from 'swagger-client'
import swaggerSpec from '../../../lib/apidoc.json'
import { connect } from 'react-redux'
import { getProperty } from '../../../reducers/index'
import { changeSelections } from '../../../actions/index'
import { booleanPropertyFromTemplate, defaultValuesFromPropertyTemplate } from '../../../Utilities'
import Config from '../../../Config'
import Button from 'react-bootstrap/lib/Button'
import Modal from 'react-bootstrap/lib/Modal'

const AsyncTypeahead = asyncContainer(Typeahead)

class InputLookupQAContext extends Component {
  constructor(props) {
    super(props)

    const defaults = defaultValuesFromPropertyTemplate(this.props.propertyTemplate)

    if (defaults.length === 0) {
      // Property templates do not require defaults but we like to know when this happens
      console.info(`no defaults defined in property template: ${JSON.stringify(this.props.propertyTemplate)}`)
    }

    this.state = {
      isLoading: false,
      defaults,
      show: false, 
      query: "",
      options: [],
    }

    this.lookupClient = Swagger({ spec: swaggerSpec })
  }

  handleChange = (event) => {
      const usr_input = event.target.value
      this.setState({ query: usr_input })
  }
  
  
  handleClick = () => {
      let query = this.state.query;
      this.doSearch(query);
      this.handleShow();
  }
  
  displayResults = () => {
      let options = this.state.options;
      if(options.length > 0) {
          return this.renderMenuFunc(options);
      }
      return "No results"
  }
  
  renderInputAndButton = (id, typeaheadProps) => {
      let buttonSpacer = {marginBottom: '10px'};
      return ( <div>
          <input
          className="form-control"
          id={"inputQAContext" + id}
          onChange={this.handleChange}
          value={this.state.query}
          {...typeaheadProps}
          />
          <Button bsSize="small"
          onClick={this.handleClick} style={buttonSpacer}>Search</Button>
         </div>);
  }
  
  doSearch = (query) => {
      this.setState({ isLoading: true })
      this.lookupClient.then((client) => {
        // create array of promises based on the lookup config array that is sent in
        const lookupPromises = lookupConfigs.map((lookupConfig) => {
          authority = lookupConfig.authority
          subauthority = lookupConfig.subauthority
          language = lookupConfig.language

          /*
           *return the 'promise'
           *Since we don't want promise.all to fail if
           *one of the lookups fails, we want a catch statement
           *at this level which will then return the error. Subauthorities require a different API call than authorities so need to check if subauthority is available
           *The only difference between this call and the next one is the call to Get_searchSubauthority instead of
           *Get_searchauthority.  Passing API call in a variable name/dynamically, thanks @mjgiarlo
           */
          const actionFunction = lookupConfig.subauthority ? 'GET_searchSubauthority' : 'GET_searchAuthority'

          return client
            .apis
            .SearchQuery?.[actionFunction]({
              q: query,
              vocab: authority,
              subauthority,
              maxRecords: Config.maxRecordsForQALookups,
              lang: language,
            })
            .catch((err) => {
              console.error('Error in executing lookup against source', err)
              // return information along with the error in its own object
              return { isError: true, errorObject: err }
            })
        })

        /*
         * If undefined, add info - note if error, error object returned in object
         * which allows attaching label and uri for authority
         */
        Promise.all(lookupPromises).then((values) => {
          for (let i = 0; i < values.length; i++) {
            if (values[i]) {
              values[i].authLabel = lookupConfigs[i].label
              values[i].authURI = lookupConfigs[i].uri
            }
          }

          this.setState({
            isLoading: false,
            options: values,
          })
        })
      }).catch(() => false)
    }
  
 
  handleShow = () => {
      this.setState({ show: true })
  }

  handleClose = () => {
      this.setState({ show: false })
  }
 
  renderContext = ( context, idx, outerIndex ) => { 
      let contextContent = [];
      let mainLabelProperty = "Authoritative Label";
      let divKey = idx + "-" + outerIndex;
      if(context) {
          contextContent = context.map( (contextResult, index) => {
              let property = contextResult.property;
              //if property is authoritative label don't show it
              if(property != mainLabelProperty) {
                  let values = contextResult.values;
                  let innerDivKey = "c" + index;
                  if(values.length) {
                      return (<div key={innerDivKey}> {contextResult.property}: {contextResult.values.join(", ")} </div>) 
                  }
             }
          });
      }
     return (<div key={divKey}> {contextContent} </div>);
  }
  
  dispModal = (id, typeaheadProps) => {
      return(
        <Modal show={this.state.show} onHide={this.handleClose} id={"modal" + id}>
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {this.renderInputAndButton("modalInput-" + id, typeaheadProps)}
        {this.displayResults()}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.handleClose}>Submit</Button>
        <Button onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
      )
    }
  
  
  render() {
    let authority
    let language
    let subauthority
    const lookupConfigs = this.props.lookupConfig

    const isMandatory = booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
    const isRepeatable = booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)

    const typeaheadProps = {
      id: 'lookupComponent',
      required: isMandatory,
      multiple: isRepeatable,
      placeholder: this.props.propertyTemplate.propertyLabel,
      useCache: true,
      selectHintOnEnter: true,
      isLoading: this.state.isLoading,
      options: this.state.options,
      selected: this.state.selected,
      defaultSelected: this.state.defaults,
      delay: 300,
    }

    return (
            <div>
                <input
                className="form-control"
                id={"inputQAContext" + this.props.key}
                onChange={this.handleChange}
                {...typeaheadProps}
                />
                <Button bsSize="small"
                onClick={this.handleClick}>Search</Button>
                {this.dispModal(this.props.key, typeaheadProps)}   
             </div>   
    )
  }
}

InputLookupQAContext.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      useValuesFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    }),
  }).isRequired,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)
  return { selected: result }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQAContext)