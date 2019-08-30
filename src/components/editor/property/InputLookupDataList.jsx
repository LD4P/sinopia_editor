// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DataListInput from 'react-datalist-input'
import search from 'actionCreators/qa'
import { changeSelections } from 'actions/index'
import { isValidURI } from 'Utilities'
import {
  itemsForProperty, getDisplayValidations, getPropertyTemplate, findErrors,
} from 'selectors/resourceSelectors'
import { booleanPropertyFromTemplate } from 'utilities/propertyTemplates'
import InputValue from './InputValue'
import PropTypes from 'prop-types'
import SinopiaPropTypes from 'SinopiaPropTypes'

const InputLookupDataList = (props) => {

  // if (!props.propertyTemplate) {
  //   return null
  // }
  // const handleEdit = (content, lang) => {
    // setContent(content)
    // setLang(lang)
    // inputLiteralRef.current.focus()
  // }
  // const itemKeys = Object.keys(props.items)
  // const addedList = itemKeys.map(itemId => (<InputValue key={itemId}
  //                                                       handleEdit={handleEdit}
  //                                                       reduxPath={[...props.reduxPath, 'items', itemId]} />))
  const matchCurrentInput = (userInput, item) => {
    console.log(`in matchCurrentInput ${userInput}`, item, props)
    const results = props.search(userInput)
    console.log(results)
    props.items.append( { id: 'etef', label: 'Etef'} )
    // const newItems = props.items

    // return item.label.substr(0, currentInput.length).toUpperCase() === currentInput.toUpperCase();
    return true
  }

  const addedList = []

  const onSelect = (item) => {
    console.log(`in onSelect`, item)
    // addedList.append(item)
    return { item }
  }



  let error
  const groupClasses = 'form-group'

  const disabled = !booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)
      && Object.keys(props.items).length > 0

  const selections = () => { return [] }

  // const isMandatory = booleanPropertyFromTemplate(props.propertyTemplate, 'mandatory', false)

  // const isRepeatable = booleanPropertyFromTemplate(props.propertyTemplate, 'repeatable', true)
  if (props.displayValidations && !_.isEmpty(props.errors)) {
    groupClasses += ' has-error'
    error = props.errors.join(',')
  }
  return (
    <div className={groupClasses}>
      <DataListInput items={props.items}
                     disabled={disabled}
                     onSelect={onSelect}
                     match={matchCurrentInput} />
      {error && <span className="help-block help-block-error">{error}</span>}
      {addedList}
    </div>
  )
}

InputLookupDataList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  // matchCurrentInput: PropTypes.func,
  // onSelect: PropTypes.func,
  propertyTemplate: SinopiaPropTypes.propertyTemplate,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
}

const mapStateToProps = (state, ownProps) => {
  console.log(`in mapStateToProps`, ownProps)
  const reduxPath = ownProps.reduxPath
  const resourceTemplateId = reduxPath[reduxPath.length - 2]
  const propertyURI = reduxPath[reduxPath.length - 1]
  const displayValidations = getDisplayValidations(state)
  const propertyTemplate = getPropertyTemplate(state, resourceTemplateId, propertyURI)
  const errors = findErrors(state, ownProps.reduxPath)
  const items = []
  return {
    items,
    displayValidations,
    reduxPath,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ changeSelections, search }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLookupDataList)
