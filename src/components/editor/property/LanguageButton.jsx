// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import InputLang from './InputLang'
import { languageSelected } from 'actions/index'
import { findNode } from 'selectors/resourceSelectors'

const LanguageButton = (props) => {
  const [langPayload, setLang] = useState(null)
  const [show, setShow] = useState(false)

  const handleClose = () => {
    setShow(false)
  }

  // Passed to InputLang component so that can return a language change.
  const handleLangChange = (payload) => {
    setLang(payload)
  }

  const handleLangSubmit = () => {
    props.handleMyItemsLangChange(langPayload)
    handleClose()
  }

  const dispModal = () => (
    <Modal show={true} onHide={(handleClose)}>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLang textValue={props.textContent} reduxPath={props.reduxPath} textId={props.id} handleLangChange={handleLangChange}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleLangSubmit}>Submit</Button>
        <Button onClick={handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  return (
    <React.Fragment>
      <Button
        id="language"
        bsSize="small"
        onClick = { () => setShow(true) }>
        Language: {props.language}
      </Button>
      { show ? dispModal() : '' }
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  handleMyItemsLangChange: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  id: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  textContent: PropTypes.string.isRequired,
}

const mapStatetoProps = (state, ourProps) => {
  const node = findNode(state.selectorReducer, ourProps.reduxPath)
  const item = node.items.find(item => item.id === ourProps.id)
  return {
    language: item.lang.label,
    textContent: item.content,
  }
}


const mapDispatchToProps = dispatch => ({
  handleMyItemsLangChange(payload) {
    dispatch(languageSelected(payload))
  },
})

export default connect(mapStatetoProps, mapDispatchToProps)(LanguageButton)
