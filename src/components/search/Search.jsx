// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Form from 'react-bootstrap/lib/Form'
import fetchSearchResults from 'actionCreators/search'
import SearchResults from './SearchResults'
import SearchResultsPaging from './SearchResultsPaging'

const Search = (props) => {
  const [queryString, setQueryString] = useState('')

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.retrieveSearchResults(queryString)
      event.preventDefault()
    }
  }

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <Grid>
        <Row className="text-center">
          <Form>
            <FormGroup controlId="formGroupSearch" >
              <FormControl type="text"
                           placeholder="Search"
                           aria-label="Search"
                           onChange={ event => setQueryString(event.target.value) }
                           onKeyPress={ event => handleKeyPress(event) } />
            </FormGroup>
          </Form>
        </Row>
        <SearchResults {...props} />
        <SearchResultsPaging {...props} pageSize="1"/>
      </Grid>
    </div>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  retrieveSearchResults: PropTypes.func,
  currentUser: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  retrieveSearchResults: (queryString) => {
    dispatch(fetchSearchResults(queryString))
  },
})

export default connect(null, mapDispatchToProps)(Search)
