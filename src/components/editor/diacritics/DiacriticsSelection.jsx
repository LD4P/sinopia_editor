// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeDiacritics, itemsSelected } from 'actions/index'
import shortid from 'shortid'
import CharacterButton from './CharacterButton'
import VocabChoice from './VocabChoice'
import { findNode } from 'selectors/resourceSelectors'
import specialcharacters from '../../../../static/specialcharacters.json'


const DiacriticsSelection = () => {
  const dispatch = useDispatch()
  const [characterButtons, setCharacterButtons] = useState([])
  const show = useSelector(state => state.selectorReducer.editor.diacritics.show)
  const targetReduxPath = useSelector(state => state.selectorReducer.editor.diacritics.reduxPath)
  const targetNode = useSelector(state => findNode(state, targetReduxPath))

  let cssClasses
  if (show) {
    cssClasses = ['sticky-top', 'bg-white']
  } else {
    cssClasses = ['d-none']
  }

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
    if (targetNode.content.length > 0) {
      // hardcodes lang to eng to be consistent with default for InputLang
      const item = {
        reduxPath: targetReduxPath,
        items: {
          [shortid.generate()]: { content: targetNode.content, lang: 'eng' },
        },
      }
      dispatch(itemsSelected(item))
    }
    dispatch(closeDiacritics(targetReduxPath))
    event.preventDefault()
  }

  return (<div className={cssClasses.join(' ')}>
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
