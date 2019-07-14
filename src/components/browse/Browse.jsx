// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Header from '../Header'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import FormControl from 'react-bootstrap/lib/FormControl'
import HelpBlock from 'react-bootstrap/lib/HelpBlock'
import Button from 'react-bootstrap/lib/Button'
import { getCurrentUser } from 'authSelectors'
import { retrieveResource } from 'actionCreators'

const Browse = (props) => {
  const [uri, setURI] = useState('')

  const handleSubmit = (event) => {
    props.loadResource(props.currentUser, uri)
    props.history.push('/editor')
    event.preventDefault()
  }

  return (
    <div id="browse">
      <Header triggerEditorMenu={props.triggerHandleOffsetMenu}/>
      <div className="row">
        <form className="col-md-12">
          <FormGroup controlId="formBasicEmail">
            <ControlLabel>URI of Sinopia Resource</ControlLabel>
            <FormControl type="text"
                         placeholder="Enter URI"
                         onChange={event => setURI(event.target.value) }/>
            <HelpBlock>
              This is a temporary facility until we have search implemented.
            </HelpBlock>
          </FormGroup>
          <Button bsStyle="primary"
                  type="submit"
                  onClick={handleSubmit}>Load</Button>
        </form>
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

const mapDispatchToProps = dispatch => ({
  loadResource: (user, uri) => {
    dispatch(retrieveResource(user, uri))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Browse)
