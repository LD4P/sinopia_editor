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
import { changeSelections, removeItem } from '../../../actions/index'
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

    //selectedResultList is for the results selected from any query execution
    //selected which is stored in redux state for the lookup is for all of the values
    //stored
    this.state = {
      isLoading: false,
      defaults,
      show: false, 
      query: "",
      options: [],
      selectedResultsList: []
    }

    this.lookupClient = Swagger({ spec: swaggerSpec })
  }

  get isMandatory() {
      return booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
    }

    get isRepeatable() {
      return booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
    }
    
    validate() {
      if (!this.typeahead) {
        return
      }
      const selected = this.typeahead.getInstance().state.selected
    
      return this.props.displayValidations && this.isMandatory && selected.length < 1 ? 'Required' : undefined
    }
  
  //Add selections to selected uris for this field
  handleSubmit = (event) => {
      //Retrieve values of selected inputs
      let selected = this.state.selectedResultsList
      //we're switching out the selections entirely, not adding/removing
      selected = this.props.selected.concat(selected)
      //TODO: filter out duplicates
      const payload = {
          uri: this.props.propertyTemplate.propertyURI,
          items: selected,
          reduxPath: this.props.reduxPath,
      }
      //We want to add to, not replace selections but as first pass
      //we will replace
      this.props.handleSelectedChange(payload)
      this.handleClose()
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
  
  //handle selection of results from the search results in the modal
  handleResultChange = (event) => {
     const eventTarget = event.target
     const uri = eventTarget.value
     if(eventTarget.checked) {
         //Add uri and label to list of selected results if checked
         const label = eventTarget.getAttribute("label")
         //QA returns id as well which is NOT always the same as URI
         //Id saved in state can be used for removal later, so in this case, reusing URI
         this.setState(prevState => ({selectedResultsList: prevState.selectedResultsList.concat({id:uri, uri:uri,label:label})}))
     } else {
         //remove item if unchecked
         this.setState(prevState => ({
            selectedResultsList: prevState.selectedResultsList.filter(r => r.uri != uri)
         }))
     }
  }
  
  displayResults = () => {
      let options = this.state.options;
      if(options.length > 0) {
          return this.renderResults(options);
      }
      return "No results"
  }
  
  renderResults = ( results ) => {
      //Returning results per each promise
      //If error is returned, it will be used to display for that source
      const items = [];
      let r, i, authLabel, resultsLength, authURI, headerKey, result;
      resultsLength = results.length;
      let headingStyle = {margin: '0 -15px',
              padding: '8px 0 4px 8px',
              backgroundColor: '#ccc'}
      let labelStyle ={fontWeight:'bold',
              fontSize:'18px',
              paddingLeft: '5px'};
      let idx = 0;
      for ( i = 0; i < resultsLength; i++ ) {
          result = results[i];
          authLabel = result.authLabel;
          authURI = result.authURI;
          headerKey = authURI + "-header";
          //Add header only if more than one authority request
          if ( resultsLength > 1 )
              items.push( 
                  <h4 key={headerKey} style={headingStyle}>{authLabel}</h4>
               );
          //For this authority, display results
          if ( "isError" in result ) {
              //if error, then get error from within result and display that message
              let errorMessage = "An error occurred in retrieving results";
              let errorHeaderKey = headerKey + "-error";
              items.push( 
                  <h4 key={errorHeaderKey}><span className='dropdown-error'>{errorMessage}</span></h4>
               );
          } else {
              //if not error, print out items for result
              r = result.body;
              let resultItems = r.map( (result, index) => {
                  let contextContent = this.renderContext(result.context, idx, index);
                  let resultContext = (<div> {contextContent} </div>);
                  let bg = '#fff';    
                  idx++;
                  if(idx % 2 === 0) {
                      bg = '#ede7d4';
                  }
                  let resultStyle = {backgroundColor: bg,
                          padding: '4px 2px 2px 5px'};
                  
                  return(  <div className='row contextInfo' style={resultStyle} uri={result.uri}>  
                          <input type="checkbox" name="searchResultInput" value={result.uri} label={result.label} position={idx} key={idx} onChange={this.handleResultChange}/>
                          <span style={labelStyle}>{result.label}</span> 
                          {resultContext}
                          </div> );
              });
             resultItems.forEach( function (i) {items.push(i)});
              //if the length of results is zero we need to show that as well
              if ( r.length == 0 ) {
                  let noResultsMessage = "No results for this lookup";
                  let noResultsHeaderKey = headerKey + "-noResults";
                  items.push( 
                      <div key={noResultsHeaderKey}><span className='dropdown-empty'>{noResultsMessage}</span></div>
                   );
              }

          }
      }

      return (
         
              <div>{items}</div>
         
      )
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
      const lookupConfigs = this.props.lookupConfig
      let authority, subauthority, language
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
              context:true
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
      //everytime we close, we should also clear out the results and selected results from the modal
      //as well as original results from the query
      this.setState({ show: false, selectedResultsList: [], options: [] })
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
        <Button onClick={this.handleSubmit}>Save</Button>
        <Button onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
      )
    }
  
  makeAddedList = () => {
      const selected = this.props.selected

      if (selected === undefined) {
        return
      }
      const elements = selected.map((obj) => {
        const itemId = obj.uri 

        return <div id="userInput" key = {itemId} >
          {obj.label}
          <button
            id="deleteItem"
            type="button"
            onClick={this.handleDeleteClick}
            key={`delete${obj.uri}`}
            data-item={itemId}
            data-label={obj.label}
          >X
          </button>
        </div>
      })

      return elements
    }
  
  handleDeleteClick = (event) => {
      const labelToRemove = event.target.dataset.label
      const idToRemove = event.target.dataset.item

      this.props.handleRemoveItem(
        {
          id: idToRemove,
          label: labelToRemove,
          reduxPath: this.props.reduxPath,
          uri: this.props.propertyTemplate.propertyURI,
        },
      )
      this.setState({ disabled: false })
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
                {this.makeAddedList()}
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
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)
  return { selected: result }
}

const mapDispatchToProps = dispatch => ({
  handleSelectedChange(selected) {
    dispatch(changeSelections(selected))
  },
  handleRemoveItem(id) {
    dispatch(removeItem(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupQAContext)