// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import shortid from 'shortid'
import { removeItem, setItems, setLang } from 'actions/index'
import { findNode, getDisplayValidations, getPropertyTemplate } from 'reducers/index'
import InputLang from './InputLang'
import { defaultLangTemplate } from 'Utilities'


// Redux recommends exporting the unconnected component for unit tests.
export class InputLiteral extends Component {
  constructor(props) {
    super(props)

    /*
     * Show is whether to show the language modal.
     * Note that it is a hash because will have multiple modals if there
     * are multiple literals.
     */
    this.state = {
      show: {},
      content_add: '',
      lang_payload: null,
    }
    this.inputLiteralRef = React.createRef()
  }

  disabled = () => this.props.propertyTemplate.repeatable === 'false'
      && this.props.items?.length > 0

  handleShow = (id) => {
    const showState = {}

    showState[id] = true
    this.setState({ show: showState })
  }

  handleClose = () => {
    this.setState({ show: {}, lang_payload: null })
  }

  handleFocus = (event) => {
    document.getElementById(event.target.id).focus()
    event.preventDefault()
  }

  handleChange = (event) => {
    const userInput = event.target.value

    this.setState({ content_add: userInput })
  }

  addUserInput = (userInputArray, currentcontent) => {
    const newId = shortid.generate()

    userInputArray.push({
      content: currentcontent,
      id: newId,
    })
    return newId
  }

  handleKeypress = (event) => {
    if (event.key === 'Enter') {
      const userInputArray = []
      const currentcontent = this.state.content_add.trim()

      if (!currentcontent) {
        return
      }
      const newId = this.addUserInput(userInputArray, currentcontent)
      const userInput = {
        uri: this.props.propertyTemplate.propertyURI,
        reduxPath: this.props.reduxPath,
        items: userInputArray,
      }

      this.props.handleMyItemsChange(userInput)
      this.setDefaultLang(newId)
      this.setState({
        content_add: '',
      })
      event.preventDefault()
    }
  }

  handleDeleteClick = (event) => {
    const labelToRemove = event.target.dataset.content
    const idToRemove = event.target.dataset.item

    this.props.handleRemoveItem(
      {
        id: idToRemove,
        label: labelToRemove,
        reduxPath: this.props.reduxPath,
        uri: this.props.propertyTemplate.propertyURI,
      },
    )
  }

  handleEditClick = (event) => {
    const idToRemove = event.target.dataset.item

    this.props.items.forEach((item) => {
      if (item.id === idToRemove) {
        const itemContent = item.content

        this.setState({ content_add: itemContent })
      }
    })

    this.handleDeleteClick(event)
    this.inputLiteralRef.current.focus()
  }


    /**
     * @return {bool} true if the field should be marked as required (e.g. not all obligations met)
     */
    checkMandatoryRepeatable = () => this.props.propertyTemplate.mandatory === 'true'
        && this.props.formData.errors
        && this.props.formData.errors.length !== 0

  dispModal = (content, id) => (
    <Modal show={this.state.show[id]} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLang textValue={content} reduxPath={this.props.reduxPath} textId={id} handleLangChange={this.handleLangChange}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.handleLangSubmit}>Submit</Button>
        <Button onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  makeAddedList = () => {
    if (this.props.items === undefined) {
      return
    }

    const elements = this.props.items.map((obj) => {
      const itemId = obj.id || shortid.generate()

      return <div id="userInput" key = {itemId} >
        {obj.content}
        <button
          id="deleteItem"
          type="button"
          onClick={this.handleDeleteClick}
          key={`delete${obj.id}`}
          data-item={itemId}
          data-label={this.props.formData.uri}
        >X
        </button>
        <button
          id="editItem"
          type="button"
          onClick={this.handleEditClick}
          key={`edit${obj.id}`}
          data-item={itemId}
          data-label={this.props.formData.uri}
        >Edit
        </button>
        <Button
          id="language"
          bsSize="small"
          onClick = {e => this.handleShow(obj.id, e)}>
          Language: {obj.lang.items[0].label}
        </Button>
        {this.dispModal(obj.content, obj.id)}
      </div>
    })

    return elements
  }

  setDefaultLang = (textId) => {
    const payload = defaultLangTemplate()

    payload.id = textId
    payload.reduxPath = this.props.reduxPath
    this.props.handleMyItemsLangChange(payload)
  }

  // Passed to InputLang component so that can return a language change.
  handleLangChange = (payload) => {
    this.setState({ lang_payload: payload })
  }

  handleLangSubmit= () => {
    this.props.handleMyItemsLangChange(this.state.lang_payload)
    this.handleClose()
  }

  render() {
    // Don't render if don't have property templates yet.
    if (!this.props.propertyTemplate) {
      return null
    }

    const required = this.checkMandatoryRepeatable()
    const error = this.props.displayValidations && required ? 'Required' : undefined
    let groupClasses = 'form-group'

    if (error) {
      groupClasses += ' has-error'
    }


    return (
      <div className={groupClasses}>
        <input
              required={required}
              className="form-control"
              placeholder={this.props.propertyTemplate.propertyLabel}
              onChange={this.handleChange}
              onKeyPress={this.handleKeypress}
              value={this.state.content_add}
              disabled={this.disabled()}
              id={this.props.id}
              onClick={this.handleFocus}
              ref={this.inputLiteralRef}
        />
        {error && <span className="help-block">{error}</span>}
        {this.makeAddedList()}
      </div>
    )
  }
}

InputLiteral.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string.isRequired,
    propertyURI: PropTypes.string.isRequired,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    remark: PropTypes.string,
    valueConstraint: PropTypes.shape({
      defaults: PropTypes.array,
    }),
  }),
  formData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uri: PropTypes.string,
    errors: PropTypes.array,
  }),
  items: PropTypes.array,
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  handleMyItemsLangChange: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const reduxPath = props.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const formData = findNode(state.selectorReducer, reduxPath)
  // items has to be its own prop or rerendering won't occur when one is removed
  const items = formData.items
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)

  return {
    formData,
    items,
    reduxPath,
    propertyTemplate,
    displayValidations,
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(setItems(userInput))
  },
  handleRemoveItem(id) {
    dispatch(removeItem(id))
  },
  handleMyItemsLangChange(payload) {
    dispatch(setLang(payload))
  },

})

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
