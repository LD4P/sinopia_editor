// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import { removeItem } from 'actions/index'
import LanguageButton from './LanguageButton'
import { findNode } from 'selectors/resourceSelectors'

const InputValue = (props) => {
  const isLiteral = typeof props.item.content !== 'undefined'
  const label = isLiteral ? props.item.content : props.item.uri

  const handleEditClick = () => {
    props.handleEdit(label, props.item.lang)
    props.removeItem(props.reduxPath)
  }

  return (<div id="userInput">
    <div
      className="rbt-token rbt-token-removeable">
      {label}
      <button
        onClick={() => props.removeItem(props.reduxPath)}
        className="close rbt-close rbt-token-remove-button">
        <span aria-hidden="true">×</span>
      </button>
    </div>
    <button
      id="editItem"
      onClick={handleEditClick}
      className="btn btn-sm btn-literal btn-default">
      Edit
    </button>
    { isLiteral ? (<LanguageButton reduxPath={props.reduxPath}/>) : '' }
  </div>)
}

InputValue.propTypes = {
  item: PropTypes.object.isRequired,
  reduxPath: PropTypes.array.isRequired,
  handleEdit: PropTypes.func.isRequired,
  removeItem: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  item: findNode(state.selectorReducer, ownProps.reduxPath),
})

const mapDispatchToProps = dispatch => bindActionCreators({ removeItem }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputValue)
