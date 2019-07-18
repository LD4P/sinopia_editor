// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import Col from 'react-bootstrap/lib/Col'
import Glyphicon from 'react-bootstrap/lib/Glyphicon'
import { retrieveSearchResults } from 'actionCreators/searchResults'
import SearchResults from './SearchResults'

const Search = (props) => {
  const [queryString, setQueryString] = useState('')

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.getSearchResults(queryString)
      event.preventDefault()
    }
  }

  return (
    <div id="search">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
          <form>
            <FormGroup controlId="formHorizontalSearch">
              <Col componentClass={ControlLabel} sm={2}><h3>Search</h3></Col>
              <Col sm={10}>
                <FormControl column sm={8}
                             onChange={ event => setQueryString(event.target.value) }
                             onKeyPress={ event => handleKeyPress(event) } />
                <Glyphicon glyph="search" />
              </Col>
            </FormGroup>
          </form>
        </div>
        <div className="col-md-8"></div>
      </div>
      <SearchResults {...props} />
    </div>
  )
}

Search.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  getSearchResults: PropTypes.func,
  currentUser: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  getSearchResults: (queryString) => {
    dispatch(retrieveSearchResults(queryString))
  },
})

export default connect(null, mapDispatchToProps)(Search)
