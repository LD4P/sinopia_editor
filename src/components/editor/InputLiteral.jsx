// Copyright 2018, 2019 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setItems, removeItem } from '../../actions/index'
import PropertyRemark from './PropertyRemark'
import RequiredSuperscript from './RequiredSuperscript'
import InputLang from './InputLang'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import store from '../../store.js'

// Redux recommends exporting the unconnected component for unit tests.
export class InputLiteral extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: false,
      content_add: "",
      disabled: false
    }
    this.lastId = -1

    try {
      if (this.props.propertyTemplate.repeatable == "false") {
        this.state.disabled = true
      }
    } catch (error) {
      console.log(`repeatable not defined in the property template: ${error}`)
    }

    try {
      const defaultValue = this.props.propertyTemplate.valueConstraint.defaults[0]
      const propPredicate = this.props.propPredicate
      let defaults = this.props.defaultsForLiteral(defaultValue.defaultLiteral, propPredicate)
      this.props.setDefaultsForLiteralWithPayLoad(this.props.buttonID, this.props.propertyTemplate.propertyURI, defaults, this.props.rtId)
    } catch (error) {
      console.log(`defaults not defined in the property template: ${error}`)
    }
  }

  handleShow() {
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

  notRepeatable = (userInputArray, currentcontent) => {
    if (this.props.formData == undefined || this.props.formData.items < 1){
      this.addUserInput(userInputArray, currentcontent)
      this.setState({ disabled: true })
    }
  }

  addUserInput = (userInputArray, currentcontent) => {
    userInputArray.push({
      content: currentcontent,
      id: ++this.lastId,
      bnode: this.props.blankNodeForLiteral,
      propPredicate: this.props.propPredicate
    })
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
        this.notRepeatable(userInputArray, currentcontent)
      }
      const user_input = {
        id: this.props.buttonID,
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

  handleClick = (event) => {
    const labelToRemove = event.target.dataset["label"]
    const idToRemove = Number(event.target.dataset["item"])
    this.props.handleRemoveItem(
    {
      id: idToRemove, label: labelToRemove
    })
    this.props.formData.items.forEach(item => {
      if(item.id === idToRemove) {
        this.props.formData.items.pop(item)
      }
    })
    this.setState({disabled: false})
  }

  checkMandatoryRepeatable = () => {
     if (this.props.propertyTemplate.mandatory == "true") {
      if (this.props.formData == undefined) return true
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

  hasPropertyRemark = () => {
    if(this.props.propertyTemplate.remark) {
      return <PropertyRemark remark={this.props.propertyTemplate.remark}
          label={this.props.propertyTemplate.propertyLabel} />;
    }
    return this.props.propertyTemplate.propertyLabel;
  }

  mandatorySuperscript = () => {
    if (this.props.propertyTemplate.mandatory === "true") {
      return <RequiredSuperscript />
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
    if (formInfo == undefined) return
    const elements = formInfo.items.map((obj) => {
      return <div id="userInput" key = {obj.id} >
        {obj.content}
        <button
          id="displayedItem"
          type="button"
          onClick={this.handleClick}
          key={obj.id}
          data-item={obj.id}
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
      <div className="form-group">
        <label htmlFor={"typeLiteral" + this.props.id}
               title={this.props.propertyTemplate.remark}>
          {this.hasPropertyRemark()}
          {this.mandatorySuperscript()}
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
        </label>
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
    uri: PropTypes.string.isRequired,
    items: PropTypes.array
  }),
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
  rtId: PropTypes.string,
  blankNodeForLiteral: PropTypes.object,
  propPredicate: PropTypes.string
}

const mapStatetoProps = (state, props) => {
  return {
    formData: state.literal.formData.find(obj => obj.uri === props.propertyTemplate.propertyURI)
  }
}

const mapDispatchtoProps = dispatch => ({
  handleMyItemsChange(user_input){
    dispatch(setItems(user_input))
  },
  handleRemoveItem(id){
    dispatch(removeItem(id))
  }
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLiteral);
