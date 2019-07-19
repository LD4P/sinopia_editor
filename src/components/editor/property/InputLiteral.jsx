// Copyright 2018, 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'
import { connect } from 'react-redux'
import shortid from 'shortid'
import { removeItem, itemsSelected } from 'actions/index'
import { findNode, getDisplayValidations, getPropertyTemplate } from 'selectors/resourceSelectors'
import LanguageButton from './LanguageButton'
import { booleanPropertyFromTemplate, defaultLangTemplate } from 'Utilities'


// Redux recommends exporting the unconnected component for unit tests.
export class InputLiteral extends Component {
  constructor(props) {
    super(props)

    this.state = {
      content_add: '',
    }
    this.inputLiteralRef = React.createRef()
  }

  disabled = () => !booleanPropertyFromTemplate(this.props.propertyTemplate, 'repeatable', true)
      && this.props.items?.length > 0

  handleFocus = (event) => {
    document.getElementById(event.target.id).focus()
    event.preventDefault()
  }

  handleChange = (event) => {
    const userInput = event.target.value

    this.setState({ content_add: userInput })
  }

  addUserInput = (userInputArray, currentcontent) => {
    userInputArray.push({
      content: currentcontent,
      id: shortid.generate(),
      lang: defaultLangTemplate(),
    })
  }

  handleKeypress = (event) => {
    if (event.key === 'Enter') {
      const userInputArray = []
      const currentcontent = this.state.content_add.trim()

      if (!currentcontent) {
        return
      }
      this.addUserInput(userInputArray, currentcontent)
      const userInput = {
        reduxPath: this.props.reduxPath,
        items: userInputArray,
      }

      this.props.handleMyItemsChange(userInput)
      this.setState({
        content_add: '',
      })
      event.preventDefault()
    }
  }

  handleDeleteClick = (event) => {
    this.props.handleRemoveItem(this.props.reduxPath, event.target.dataset.item)
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
  checkMandatoryRepeatable = () => booleanPropertyFromTemplate(this.props.propertyTemplate, 'mandatory', false)
      && this.props.formData.errors
      && this.props.formData.errors.length !== 0

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
        <LanguageButton id={obj.id} reduxPath={this.props.reduxPath}/>
      </div>
    })

    return elements
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
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  formData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    uri: PropTypes.string,
    errors: PropTypes.array,
  }),
  items: PropTypes.array,
  handleMyItemsChange: PropTypes.func,
  handleRemoveItem: PropTypes.func,
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
    propertyTemplate,
    displayValidations,
  }
}

const mapDispatchToProps = dispatch => ({
  handleMyItemsChange(userInput) {
    dispatch(itemsSelected(userInput))
  },
  handleRemoveItem(reduxPath, itemId) {
    dispatch(removeItem(reduxPath, itemId))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(InputLiteral)
