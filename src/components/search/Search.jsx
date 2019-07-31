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
import { showSearchResults } from 'actions/index'
import SearchResults from './SearchResults'
import SearchResultsPaging from './SearchResultsPaging'
import Config from 'Config'

const Search = (props) => {
  const [queryString, setQueryString] = useState('')

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      search(queryString)
      event.preventDefault()
    }
  }

  const responseToSearchResults = json => ({
    totalHits: json.hits.total,
    results: json.hits.hits.map(row => ({
      uri: row._id,
      title: row._source.title,
    })),
  })

  const search = (query) => {
    const uri = `${Config.searchHost}${Config.searchPath}?q=title:${query}%20OR%20subtitle:${query}&from=0&size=${Config.searchResultsPerPage}`

    fetch(uri)
      .then(resp => resp.json())
      .then(json => responseToSearchResults(json))
      .then((results) => {
        props.displaySearchResults(results.results, results.totalHits, query)
      })
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
  displaySearchResults: PropTypes.func,
  currentUser: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  displaySearchResults: (searchResults, totalResults, queryString) => {
    dispatch(showSearchResults(searchResults, totalResults, queryString))
  },
})

export default connect(null, mapDispatchToProps)(Search)
