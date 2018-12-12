// Copyright 2018 Stanford University see Apache2.txt for license

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { setItems, showItems } from '../../actions/index'

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
    this.state = {
      content_add: ""
    }
    this.lastId = -1
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
       /** Mandatory true, means array must have only 1 item in the array **/ 
        if (this.props.propertyTemplate.mandatory == "true") {
          this.noRepeatableYesMandatory(userInputArray, currentcontent)
        /** Mandatory is false, or not defined. Array can have either 0 or 1 item in array. **/
        } else {
          this.noRepeatableNoMandatory(userInputArray, currentcontent)
        }
      }
      const user_input = {
        id: this.props.propertyTemplate.propertyLabel,
        items: userInputArray
      }
      this.props.handleMyItemsChange(user_input)
      this.setState({
        content_add: ""
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
    let temp = this.props.formData
      if (temp == undefined) return
      const elements = temp.items.map((obj) => {
        console.log(obj.content)
        return <div
                key = {obj.id}
                  > 
                  {obj.content}

                  <button
                    id="displayedItem"
                    type="button"
                    onClick={this.handleClick}
                    key={obj.id}
                    data-item={obj.id}
                          >X
                  </button>
                </div>
      })
    
    return elements
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

const mapStatetoProps = (state, props) => {
  return {
    formData: state.formData.find(obj => obj.id === props.propertyTemplate.propertyLabel)
  }
}

const mapDispatchtoProps = dispatch => ({
  handleMyItemsChange(user_input){
    dispatch(setItems(user_input))
  }
})

export default connect(mapStatetoProps, mapDispatchtoProps)(InputLiteral);