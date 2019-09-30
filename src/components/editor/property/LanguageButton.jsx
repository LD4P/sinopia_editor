// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import shortid from 'shortid'
import InputLang from './InputLang'
import { findNode } from 'selectors/resourceSelectors'
import { languageLabel } from 'selectors/entitySelectors'

const LanguageButton = (props) => {
  const modalIdentifier = shortid.generate()
  const modalIdentiferTarget = `#${modalIdentifier}`

  return (
    <React.Fragment>
      <button
        id="language"
        data-toggle="modal"
        onClick={event => event?.preventDefault()}
        data-target={modalIdentiferTarget}
        className="btn btn-sm btn-secondary btn-literal">
        Language: {props.language}
      </button>
      <InputLang reduxPath={props.reduxPath} id={modalIdentifier}/>
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
