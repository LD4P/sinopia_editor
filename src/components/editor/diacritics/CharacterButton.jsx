// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { selectLiteralInputContent } from 'selectors/inputs'
import { setLiteralContent } from 'actions/inputs'

const CharacterButton = (props) => {
  const dispatch = useDispatch()
  const targetPropertyKey = useSelector((state) => state.selectorReducer.editor.diacritics.key)
  const content = useSelector((state) => selectLiteralInputContent(state, targetPropertyKey)) || ''

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
    const newValue = content + cleanCharacter()
    dispatch(setLiteralContent(targetPropertyKey, newValue))
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
