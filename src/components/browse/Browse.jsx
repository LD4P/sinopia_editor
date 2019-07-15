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
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators'
import SearchResults from './SearchResults'

const Browse = (props) => {
  const [queryString, setQueryString] = useState('')

<<<<<<< HEAD
  const handleSubmit = (event) => {
    event.preventDefault()
    props.loadResource(props.currentUser, uri)
=======
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      props.getSearchResults(queryString)
      event.preventDefault()
    }
>>>>>>> Add initial search results page and handle input on form
  }

  return (
    <div id="browse">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <div className="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
          <form>
            <FormGroup controlId="formHorizontalSearch">
              <Col componentClass={ControlLabel} sm={2}>Search</Col>
              <Col sm={10}>
                <FormControl column sm={8}
                             onChange={ event => setQueryString(event.target.value) }
                             onKeyPress={ event => handleKeyPress(event) } />
                <Glyphicon glyph="search" />
              </Col>
            </FormGroup>
          </form>
        </div>
        <div class="col-md-2"></div>
      </div>
      <div className="row">
        <h2>{ queryString }</h2>
      </div>
      <SearchResults {...props} />
    </div>
  )
}

Browse.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  getSearchResults: PropTypes.func,
  currentUser: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

<<<<<<< HEAD
const mapDispatchToProps = (dispatch, ourProps) => ({
  loadResource: (user, uri) => {
    dispatch(retrieveResource(user, uri)).then(() => {
      ourProps.history.push('/editor')
    })
=======
const mapDispatchToProps = dispatch => ({
  getSearchResults: (queryString) => {
    // dispatch(retrieveResource(user, uri))
>>>>>>> Add initial search results page and handle input on form
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
