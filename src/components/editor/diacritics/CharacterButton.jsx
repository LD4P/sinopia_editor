// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

const CharacterButton = (props) => {
  const targetReduxPath = useSelector(state => state.selectorReducer.editor.diacritics.reduxPath)
  const targetElement = document.getElementById(targetReduxPath.join(''))


  const handleClick = (event) => {
    const existingValue = targetElement.value
    targetElement.value = existingValue + props.character
    targetElement.focus()
    event.preventDefault()
  }

  return (
    <button className="btn btn-light"
            style={{ margin: '3px' }}
            value={props.character}
            onClick={handleClick}>{props.character}</button>
  )
}

CharacterButton.propTypes = {
  character: PropTypes.string,
}

export default CharacterButton
