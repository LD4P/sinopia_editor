// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import shortid from 'shortid'
import { removeItem, setItems, setLang } from '../../../actions/index'
import { getProperty, getDisplayValidations } from '../../../reducers/index'
import InputLang from './InputLang'
import { defaultLangTemplate } from '../../../Utilities'


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
      disabled: false,
      lang_payload: null,
    }
    this.inputLiteralRef = React.createRef()
  }

  componentDidMount = () => {
    if (this.props.propertyTemplate.repeatable === 'false'
        && this.props.formData !== undefined
        && this.props.formData.items.length > 0) {
      this.setState({ disabled: true })
    }
  }


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

  notRepeatableAfterUserInput = (userInputArray, currentcontent) => {
    let newId = null

    if (this.props.formData === undefined || this.props.formData.items < 1) {
      newId = this.addUserInput(userInputArray, currentcontent)
      this.setState({ disabled: true })
    }
    return newId
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
      let newId = null

      if (this.props.propertyTemplate.repeatable === 'true') {
        newId = this.addUserInput(userInputArray, currentcontent)
      } else if (this.props.propertyTemplate.repeatable === 'false') {
        newId = this.notRepeatableAfterUserInput(userInputArray, currentcontent)
      }
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
    this.setState({ disabled: false })
  }

  handleEditClick = (event) => {
    const idToRemove = event.target.dataset.item

    this.props.formData.items.forEach((item) => {
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
  checkMandatoryRepeatable = () => {
    if (this.props.propertyTemplate.mandatory === 'true') {
      if (this.props.formData === undefined || this.props.formData.items === undefined) return true
      const inputLength = this.props.formData.items.length

      if (inputLength > 0) {
        return false
      }
      return true
    }
    if (this.props.propertyTemplate.mandatory === 'false') {
      return false
    }
  }

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
    const formInfo = this.props.formData

    if (formInfo === undefined || formInfo.items === undefined) {
      return
    }
    const elements = formInfo.items.map((obj) => {
      const itemId = obj.id || shortid.generate()

      return <div id="userInput" key = {itemId} >
        {obj.content}
        <button
          id="deleteItem"
          type="button"
          onClick={this.handleDeleteClick}
          key={`delete${obj.id}`}
          data-item={itemId}
          data-label={formInfo.uri}
        >X
        </button>
        <button
          id="editItem"
          type="button"
          onClick={this.handleEditClick}
          key={`edit${obj.id}`}
          data-item={itemId}
          data-label={formInfo.uri}
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
              disabled={this.state.disabled}
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
  }).isRequired,
  formData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uri: PropTypes.string,
    items: PropTypes.array,
  }),
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  handleMyItemsLangChange: PropTypes.func,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  blankNodeForLiteral: PropTypes.object,
  propPredicate: PropTypes.string,
  setDefaultsForLiteralWithPayLoad: PropTypes.func,
  defaultsForLiteral: PropTypes.func,
  displayValidations: PropTypes.bool,
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)
  const displayValidations = getDisplayValidations(state)

  return { formData: { items: result, displayValidations } }
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
