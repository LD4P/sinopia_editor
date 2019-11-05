// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, connect } from 'react-redux'
import InputLang from './InputLang'
import { showModal } from 'actions/modals'
import { findNode } from 'selectors/resourceSelectors'
import { languageLabel } from 'selectors/entitySelectors'

const LanguageButton = (props) => {
  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal('LanguageModal'))
  }

  return (
    <React.Fragment>
      <button
        id="language"
        onClick={ handleClick }
        className="btn btn-sm btn-secondary btn-literal">
        Language: {props.language}
      </button>
      <InputLang reduxPath={props.reduxPath} />
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  reduxPath: PropTypes.array.isRequired,
  language: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ourProps) => {
  const language = languageLabel(state, findNode(state, ourProps.reduxPath).lang)
  return {
    language,
  }
}

export default connect(mapStateToProps)(LanguageButton)
