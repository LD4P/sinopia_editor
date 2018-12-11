// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setItems } from '../../actionCreators'

class InputLiteral extends Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.checkMandatoryRepeatable = this.checkMandatoryRepeatable.bind(this)
    this.noRepeatableNoMandatory = this.noRepeatableNoMandatory.bind(this)
    this.noRepeatableYesMandatory = this.noRepeatableYesMandatory.bind(this)
    this.addUserInput = this.addUserInput.bind(this)
    this.defaultLiteralValue = this.defaultLiteralValue.bind(this)

    this.state = {
      content_add: "",
      myItems: []
    }
    this.lastId = -1
    this.defaultLiteralValue()
  }
  
  handleChange(event) {
    const usr_input = event.target.value
    this.setState({ content_add: usr_input })
  }

  noRepeatableYesMandatory(userInputArray, currentcontent) {
    if (userInputArray.length == 0) {
      this.addUserInput(userInputArray, currentcontent)
    }
  }

  noRepeatableNoMandatory(userInputArray, currentcontent) {
    if (userInputArray.length < 1) {
      this.addUserInput(userInputArray, currentcontent)
    }
  }

  addUserInput(userInputArray, currentcontent) {
    userInputArray.push({
      content: currentcontent,
      id: ++this.lastId
    })
  }

  handleKeypress(event) {
    if (event.key == "Enter") {
      var userInputArray = this.state.myItems
      var currentcontent = this.state.content_add.trim()
      if (!currentcontent) {
        return
      }
      /** Input field is repeatable, add user input to array.**/
      if (this.props.propertyTemplate.repeatable == "true") {
        this.addUserInput(userInputArray, currentcontent)
      /** Input field is not repeatable **/
      } else if (this.props.propertyTemplate.repeatable == "false") {
       /** Mandatory true, means array must have only 1 item in the array **/ 
        if (this.props.propertyTemplate.mandatory == "true") {
          this.noRepeatableYesMandatory(userInputArray, currentcontent)
        /** Mandatory is false, or not defined. Array can have either 0 or 1 item in array. **/
        } else {
          this.noRepeatableNoMandatory(userInputArray, currentcontent)
        }
      }
      this.setState({
        myItems: userInputArray,
        content_add: "",
      })
      event.preventDefault()
    }
  }

  handleClick(event) {
    const idToRemove = Number(event.target.dataset["item"])
    const userInputArray = this.state.myItems.filter((listitem) => {return listitem.id !== idToRemove})
    this.setState({ myItems: userInputArray })
  }
  
  checkMandatoryRepeatable() {
     if (this.props.propertyTemplate.mandatory == "true") {
      if (this.makeAddedList().length > 0) {
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

  makeAddedList() {
    const elements = this.state.myItems.map((listitem) => (
      <div
        key={listitem.id}
      >
        {listitem.content}
      
        <button
          id="displayedItem"
          type="button"
          onClick={this.handleClick}
          key={listitem.id}
          data-item={listitem.id}
          >X
        </button>
      </div>

    ))
    return elements
  }

  defaultLiteralValue() {
    const valConstraint = this.props.propertyTemplate.valueConstraint
    if (valConstraint == undefined || valConstraint == "") return

    let defvalues
    try{
      defvalues = valConstraint.defaults[0]
    } catch (error) {
      console.info("valConstraint.defaults is empty in profile")
    }

    if (defvalues == undefined) return
    this.state.myItems.push({content: defvalues.defaultLiteral, id: ++this.lastId})
  }

  render() {
    return (
      <div className="form-group">
        <label htmlFor="typeLiteral">
          {this.props.propertyTemplate.propertyLabel}
          <input
            required={this.checkMandatoryRepeatable()}
            className="form-control"
            placeholder={this.props.propertyTemplate.propertyLabel}
            onChange={this.handleChange}
            onKeyPress={this.handleKeypress}
            value={this.state.content_add}
            id="typeLiteral"
          />
          {this.makeAddedList()}
        </label>
        
      </div>
    )
  }
}

InputLiteral.propTypes = {
  propertyTemplate: PropTypes.shape({
    propertyLabel: PropTypes.string.isRequired,
    mandatory: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    repeatable: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    valueConstraint: PropTypes.shape({
      defaults: PropTypes.array
    })
  }).isRequired
}

export default InputLiteral;