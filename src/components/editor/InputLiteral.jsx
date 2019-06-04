// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import shortid from 'shortid'
import { removeItem, setItems } from '../../actions/index'
import { getProperty } from '../../reducers/index'
import InputLang from './InputLang'
import store from '../../store'

// Redux recommends exporting the unconnected component for unit tests.
export class InputLiteral extends Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      content_add: '',
      disabled: false,
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


  handleShow = () => {
    this.setState({ show: true })
  }

  handleClose = () => {
    this.setState({ show: false })
  }

  handleFocus = (event) => {
    document.getElementById(event.target.id).focus()
    event.preventDefault()
  }

  handleChange = (event) => {
    const usr_input = event.target.value

    this.setState({ content_add: usr_input })
  }

  notRepeatableAfterUserInput = (userInputArray, currentcontent) => {
    if (this.props.formData == undefined || this.props.formData.items < 1) {
      this.addUserInput(userInputArray, currentcontent)
      this.setState({ disabled: true })
    }
  }

  addUserInput = (userInputArray, currentcontent) => {
    const newId = shortid.generate()

    userInputArray.push({
      content: currentcontent,
      id: newId,
    })
  }

  handleKeypress = (event) => {
    if (event.key == 'Enter') {
      const userInputArray = []
      const currentcontent = this.state.content_add.trim()

      if (!currentcontent) {
        return
      }
      if (this.props.propertyTemplate.repeatable == 'true') {
        this.addUserInput(userInputArray, currentcontent)
      } else if (this.props.propertyTemplate.repeatable == 'false') {
        this.notRepeatableAfterUserInput(userInputArray, currentcontent)
      }
      const user_input = {
        uri: this.props.propertyTemplate.propertyURI,
        reduxPath: this.props.reduxPath,
        items: userInputArray,
      }

      this.props.handleMyItemsChange(user_input)
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
      if (item.id == idToRemove) {
        const itemContent = item.content

        this.setState({ content_add: itemContent })
      }
    })

    this.handleDeleteClick(event)
    this.inputLiteralRef.current.focus()
  }


  checkMandatoryRepeatable = () => {
    if (this.props.propertyTemplate.mandatory == 'true') {
      if (this.props.formData == undefined || this.props.formData.items == undefined) return true
      const inputLength = this.props.formData.items.length

      if (inputLength > 0) {
        return false
      }

      return true
    }
    if (this.props.propertyTemplate.mandatory == 'false') {
      return false
    }
  }

  dispModal = content => (
    <Modal show={this.state.show} onHide={this.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Languages</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputLang textValue={content}/>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={this.handleClose}>Submit</Button>
        <Button onClick={this.handleClose}>Close</Button>
      </Modal.Footer>
    </Modal>
  )

  dispLang = (content) => {
    const newState = store.getState()
    const index = newState.lang.formData.map(o => o.id).indexOf(content)
    let newLang

    try {
      newLang = newState.lang.formData[index].items[0].label
    } catch (error) {
      // ignore
    }

    if (newLang === undefined) {
      return 'English'
    }

    return newLang
  }

  makeAddedList = () => {
    const formInfo = this.props.formData

    if (formInfo == undefined || formInfo.items == undefined) {
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
          bsSize="small"
          onClick = {this.handleShow}>
          Language: {this.dispLang(obj.content)}
        </Button>
        {this.dispModal(obj.content)}
      </div>
    })

    return elements
  }

  render() {
    return (
      <div>
        <input
              required={this.checkMandatoryRepeatable()}
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
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  blankNodeForLiteral: PropTypes.object,
  propPredicate: PropTypes.string,
  setDefaultsForLiteralWithPayLoad: PropTypes.func,
  defaultsForLiteral: PropTypes.func,
}

const mapStateToProps = (state, props) => {
  const result = getProperty(state, props)


  return { formData: { items: result } }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(user_input) {
    dispatch(setItems(user_input))
  },
  handleRemoveItem(id) {
    dispatch(removeItem(id))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
