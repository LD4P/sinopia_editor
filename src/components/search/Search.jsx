// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Form from 'react-bootstrap/lib/Form'
import Alert from 'react-bootstrap/lib/Alert'
import fetchSearchResults from 'actionCreators/search'
import SearchResults from './SearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import SearchResultsMessage from './SearchResultsMessage'

const Search = (props) => {
  const [queryString, setQueryString] = useState('')
  const [showAlert, setShowAlert] = useState(props.error)


  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.fetchSearchResults(queryString)
      event.preventDefault()
    }
  }

  let alert

  if (showAlert) {
    alert = (
      <Alert key="0" bsStyle="warning">
        <button className="close" aria-label="close" onClick={() => setShowAlert(false)}>&times;</button>
        {props.error.message}
      </Alert>
    )
  }

  useEffect(() => {
    setShowAlert(props.error)
  }, [props.error])

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      {alert}
      <Grid>
        <Row className="text-center">
          <Form>
            <FormGroup controlId="formGroupSearch" >
              <FormControl type="text"
                           placeholder="Search"
                           aria-label="Search"
                           onChange={ event => setQueryString(event.target.value) }
                           onKeyPress={ event => handleKeyPress(event) } />
              <span className="help-block">Use a * to wildcard your search.</span>
            </FormGroup>
          </Form>
        </Row>
        <SearchResults {...props} key="search-results" />
        <SearchResultsPaging {...props} pageSize="1"/>
        <SearchResultsMessage />
      </Grid>
    </div>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  fetchSearchResults: PropTypes.func,
  currentUser: PropTypes.object,
  query: PropTypes.string,
  error: PropTypes.object,
}

const mapDispatchToProps = dispatch => bindActionCreators({ fetchSearchResults }, dispatch)

const mapStateToProps = state => ({
  query: state.selectorReducer.search.query,
  error: state.selectorReducer.search.error,
})

export default connect(mapStateToProps, mapDispatchToProps)(Search)
