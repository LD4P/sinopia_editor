// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { setLiteralContent } from 'actions/index'
import { useSelector, useDispatch } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'

const CharacterButton = (props) => {
  const targetReduxPath = useSelector(state => state.selectorReducer.editor.diacritics.reduxPath)
  const inputNode = useSelector(state => findNode(state, targetReduxPath))

  const dispatch = useDispatch()

  const handleClick = (event) => {
    const existingValue = inputNode.content || ''
    const newValue = existingValue + props.character
    dispatch(setLiteralContent(newValue, targetReduxPath))
    event.preventDefault()
  }

  return (
    <button className="btn btn-light"
            style={{ margin: '3px' }}
            onClick={handleClick}>{props.character}</button>
  )
}

CharacterButton.propTypes = {
  character: PropTypes.string,
}

export default CharacterButton
