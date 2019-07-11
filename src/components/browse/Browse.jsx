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
import { retrieveResource } from 'actionCreators/resources'

const Browse = (props) => {
  const [uri, setURI] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    props.loadResource(props.currentUser, uri)
  }


//   <!-- Search form -->
// <form class="form-inline md-form form-sm active-cyan-2 mt-2">
//   <input class="form-control form-control-sm mr-3 w-75" type="text" placeholder="Search"
//     aria-label="Search">
//   <i class="fas fa-search" aria-hidden="true"></i>
// </form>

  return (
    <div id="browse">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu} />
      <div className="row">
        <div class="col-md-2"></div>
        <div class="col-md-8">
          <form horizontal>
            <FormGroup controlId="formHorizontalSearch">
              <Col componentClass={ControlLabel} sm={2}>Search</Col>
              <Col sm={10}>
                <FormControl column sm={8}
                             onChange={event => setURI(event.target.value) } />
                <Glyphicon glyph="search" />
              </Col>
            </FormGroup>
          </form>
        </div>
        <div class="col-md-2"></div>
      </div>
    </div>
  )
}

Browse.propTypes = {
  triggerHandleOffsetMenu: PropTypes.func,
  loadResource: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
}

const mapStateToProps = state => ({
  currentUser: getCurrentUser(state),
})

const mapDispatchToProps = (dispatch, ourProps) => ({
  loadResource: (user, uri) => {
    dispatch(retrieveResource(user, uri)).then(() => {
      ourProps.history.push('/editor')
    })
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
