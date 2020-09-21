// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideDiacritics } from 'actions/inputs'
import shortid from 'shortid'
import CharacterButton from './CharacterButton'
import VocabChoice from './VocabChoice'
import specialcharacters from '../../../../static/specialcharacters.json'
import { displayDiacritics } from 'selectors/inputs'

// specialcharacters.json imported above is derived from Mediawiki's specialcharacters.json
// See https://github.com/wikimedia/mediawiki/blob/master/resources/src/mediawiki.language/specialcharacters.json

const DiacriticsSelection = () => {
  const dispatch = useDispatch()
  const [characterButtons, setCharacterButtons] = useState([])
  const show = useSelector((state) => displayDiacritics(state))

  if (!show) return null

  const selectVocabulary = (event) => {
    const vocabChoice = event.target.value
    if (vocabChoice === undefined) return null
    const buttons = []
    specialcharacters[vocabChoice].characters.map((char) => {
      buttons.push(<CharacterButton key={shortid.generate()}
                                    character={char} />)
    })
    setCharacterButtons(buttons)
    event.preventDefault()
  }

  const closeHandler = (event) => {
    dispatch(hideDiacritics())
    event.preventDefault()
  }

  return (<div id="diacritics-selection" className="sticky-top bg-white" tabIndex="0">
    <div className="row">
      <section className="col-1 offset-9">
        <button className="btn btn-lg" onClick={closeHandler}>&times;</button>
      </section>
    </div>

    <div className="row">
      <section className="col-3">
        <VocabChoice selectVocabulary={selectVocabulary} />
      </section>
      <section className="col-7">
        <div style={{ overflow: 'scroll', height: '200px' }}>
          {characterButtons}
        </div>
      </section>
    </div>
  </div>)
}

export default DiacriticsSelection
