// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"

const CharacterButton = (props) => {
  const cleanCharacter = () => {
    // For some reason, some combining characters are precombined with ◌ (U+25CC)
    let cleanChars = ""
    if (props.character.length > 1) {
      for (let i = 0; i < props.character.length; i++) {
        if (props.character.codePointAt(i) !== 9676) {
          cleanChars += props.character[i]
        }
      }
    } else {
      cleanChars = props.character
    }
    return cleanChars
  }

  const handleClick = (event) => {
    props.handleAddCharacter(cleanCharacter())
    event.preventDefault()
  }

  return (
    <button
      className="btn btn-light"
      style={{ margin: "3px" }}
      onClick={handleClick}
    >
      {props.character}
    </button>
  )
}

CharacterButton.propTypes = {
  character: PropTypes.string.isRequired,
  handleAddCharacter: PropTypes.func.isRequired,
}

export default CharacterButton
