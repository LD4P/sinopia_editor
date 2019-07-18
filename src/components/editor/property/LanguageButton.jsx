// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import InputLang from './InputLang'
import { languageSelected } from 'actions/index'
import { defaultLangTemplate } from 'Utilities'

const LanguageButton = (props) => {
  const [langPayload, setLang] = useState(null)
  const [show, setShow] = useState(false)
  const lang = props.language.lang || defaultLangTemplate()

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

  const dispModal = (content, id) => (
    <Modal show={true} onHide={(handleClose)}>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLang textValue={content} reduxPath={props.reduxPath} textId={id} handleLangChange={handleLangChange}/>
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
        Language: {lang.label}
      </Button>
      { show ? dispModal(props.language.content, props.language.id) : '' }
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  handleMyItemsLangChange: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired,
  language: PropTypes.object,
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsLangChange(payload) {
    dispatch(languageSelected(payload))
  },
})

export default connect(null, mapDispatchToProps)(LanguageButton)
