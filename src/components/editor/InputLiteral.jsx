// Copyright 2018, 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setItems, removeItem } from '../../actions/index'
import { getProperty } from '../../reducers/index'
import InputLang from './InputLang'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import store from '../../store.js'

// Redux recommends exporting the unconnected component for unit tests.
export class InputLiteral extends Component {

  constructor(props) {
    super(props)
    let lastId
    try {
      lastId =  Number(props.propertyTemplate.valueConstraint.defaults.length)-1
    } catch (err) {
      lastId = -1
    }
    this.state = {
      show: false,
      content_add: "",
      disabled: false,
      lastId: lastId
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
  }

  handleChange = (event) => {
    const usr_input = event.target.value
    this.setState({ content_add: usr_input })
  }

  notRepeatableAfterUserInput = (userInputArray, currentcontent) => {
    if (this.props.formData == undefined || this.props.formData.items < 1){
      this.addUserInput(userInputArray, currentcontent)
      this.setState({ disabled: true })
    }
  }

  addUserInput = (userInputArray, currentcontent) => {
    const newId = this.state.lastId + 1
    userInputArray.push({
      content: currentcontent,
      id: newId
    })
    this.setState( { lastId: newId } )
  }

  handleKeypress = (event) => {
    if (event.key == "Enter") {
      var userInputArray = []
      var currentcontent = this.state.content_add.trim()
      if (!currentcontent) {
        return
      }
      /** Input field is repeatable, add user input to array.**/
      if (this.props.propertyTemplate.repeatable == "true") {
        this.addUserInput(userInputArray, currentcontent)
      /** Input field is not repeatable **/
      } else if (this.props.propertyTemplate.repeatable == "false") {
        this.notRepeatableAfterUserInput(userInputArray, currentcontent)
      }
      const user_input = {
        uri: this.props.propertyTemplate.propertyURI,
        rtId: this.props.rtId,
        items: userInputArray
      }
      this.props.handleMyItemsChange(user_input)
      this.setState({
        content_add: ""
      })
      event.preventDefault()
    }
  }

  handleItemClick = (event) => {
    const labelToRemove = event.target.dataset["content"]
    const idToRemove = Number(event.target.dataset["item"])

    this.props.handleRemoveItem(
    {
      id: idToRemove,
      label: labelToRemove,
      rtId: this.props.rtId,
      uri: this.props.propertyTemplate.propertyURI
    })
    this.setState({ disabled: false })
  }

  checkMandatoryRepeatable = () => {
     if (this.props.propertyTemplate.mandatory == "true") {
      if (this.props.formData == undefined || this.props.formData.items == undefined) return true
      const inputLength = (this.props.formData.items).length
      if (inputLength > 0) {
        return false
      }
      else {
        return true
      }
     }
     else if (this.props.propertyTemplate.mandatory == "false") {
      return false
     }
  }

  dispModal = (content) => {
    return(
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
  }

  dispLang = (content) => {
    let newState = store.getState()
    const index = newState.lang.formData.map(function(o) { return o.id; }).indexOf(content);
    let newLang
    try {
      newLang = newState.lang.formData[index].items[0].label
    } catch (error) {
      // ignore
    }

    if (newLang === undefined) {
      return "English"
    } else{
      return newLang
    }
  }

  makeAddedList = () => {
    let formInfo = this.props.formData
    if (formInfo == undefined || formInfo.items == undefined) {
      return
    }
    const elements = formInfo.items.map((obj, index) => {
      return <div id="userInput" key = {index} >
        {obj.content}
        <button
          id="displayedItem"
          type="button"
          onClick={this.handleItemClick}
          key={obj.id}
          data-item={index}
          data-label={formInfo.uri}
        >X
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
              id={"typeLiteral" + this.props.id}
              onClick={this.handleFocus}
            />
            {this.makeAddedList()}
        </div>
    )
  }
}

InputLiteral.propTypes = {
  id: PropTypes.number,
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string.isRequired,
    propertyURI: PropTypes.string.isRequired,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    remark: PropTypes.string,
    valueConstraint: PropTypes.shape({
      defaults: PropTypes.array
    })
  }).isRequired,
  formData: PropTypes.shape({
    id: PropTypes.number,
    uri: PropTypes.string,
    items: PropTypes.array
  }),
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  rtId: PropTypes.string,
  blankNodeForLiteral: PropTypes.object,
  propPredicate: PropTypes.string,
  setDefaultsForLiteralWithPayLoad: PropTypes.func,
  defaultsForLiteral: PropTypes.func
}

const mapStateToProps = (state, props) => {
  let result = getProperty(state, props)
  return { formData: { items: result } }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(user_input){
    dispatch(setItems(user_input))
  },
  handleRemoveItem(id){
    dispatch(removeItem(id))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral);
