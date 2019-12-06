// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { setLiteralContent } from 'actions/index'
import { useSelector, useDispatch } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'

const CharacterButton = (props) => {
  const targetReduxPath = useSelector((state) => state.selectorReducer.editor.diacritics.reduxPath)
  const inputNode = useSelector((state) => findNode(state, targetReduxPath))

  const dispatch = useDispatch()

  const cleanCharacter = () => {
    // For some reason, some combining characters are precombined with ◌ (U+25CC)
    if (props.character.length > 1) {
      for (let i = 0; i < props.character.length; i++) {
        if (props.character.codePointAt(i) !== 9676) return props.character[i]
      }
    }
    return props.character
  }

  const handleClick = (event) => {
    const existingValue = inputNode.content || ''
    const newValue = existingValue + cleanCharacter()
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
