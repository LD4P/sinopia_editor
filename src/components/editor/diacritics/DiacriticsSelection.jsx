// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import PropTypes from "prop-types"
import CharacterButton from "./CharacterButton"
import VocabChoice from "./VocabChoice"
import specialcharacters from "../../../../static/specialcharacters.json"

// specialcharacters.json imported above is derived from Mediawiki's specialcharacters.json
// See https://github.com/wikimedia/mediawiki/blob/master/resources/src/mediawiki.language/specialcharacters.json

const DiacriticsSelection = (props) => {
  const [vocab, setVocab] = useState("")

  let characters = []
  if (vocab) {
    characters = specialcharacters[vocab].characters.map((char, index) => (
      <CharacterButton
        key={`char-${index}`}
        character={char}
        handleAddCharacter={props.handleAddCharacter}
      />
    ))
  }

  const selectVocabulary = (event) => {
    const vocabChoice = event.target.value
    if (vocabChoice === undefined) return null
    setVocab(vocabChoice)
    event.preventDefault()
  }

  const closeHandler = (event) => {
    props.closeDiacritics()
    event.preventDefault()
  }

  if (!props.showDiacritics) return null

  const keyPressHandler = (event) => {
    if (event.which === 8) event.preventDefault() // backspace should not be passed to the browser as it can cause the page to go back
  }

  return (
    <div
      id={props.id}
      onKeyDown={keyPressHandler}
      role="presentation"
      tabIndex="0"
      className="container"
    >
      <div className="row">
        <section className="col-1 offset-11">
          <button
            className="btn btn-lg"
            onClick={closeHandler}
            aria-label="Close diacritics keyboard"
          >
            &times;
          </button>
        </section>
      </div>

      <div className="row">
        <section className="col-3">
          <VocabChoice selectVocabulary={selectVocabulary} vocabulary={vocab} />
        </section>
        <section className="col-9">
          <div style={{ overflow: "scroll", height: "200px" }}>
            {characters}
          </div>
        </section>
      </div>
    </div>
  )
}

DiacriticsSelection.propTypes = {
  handleAddCharacter: PropTypes.func.isRequired,
  closeDiacritics: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  showDiacritics: PropTypes.bool.isRequired,
}

export default DiacriticsSelection
