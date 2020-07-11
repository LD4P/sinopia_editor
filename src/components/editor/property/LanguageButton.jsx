// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, connect } from 'react-redux'
import InputLang from './InputLang'
import { showModal } from 'actions/modals'
import { selectLanguageLabel } from 'selectors/languages'
import { selectValue } from 'selectors/resources'

const LanguageButton = (props) => {
  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal(`LanguageModal-${props.valueKey}`))
  }

  const languageLabel = props.language || 'No language specified'

  return (
    <React.Fragment>
      <button
        id="language"
        onClick={ handleClick }
        aria-label={`Change language for ${props.value.literal}`}
        className="btn btn-sm btn-secondary btn-literal">
        Language: {languageLabel}
      </button>
      <InputLang valueKey={props.valueKey} />
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  valueKey: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  value: PropTypes.object,
}

const mapStateToProps = (state, ourProps) => {
  const value = selectValue(state, ourProps.valueKey)
  return {
    value,
    language: selectLanguageLabel(state, value.lang),
  }
}

export default connect(mapStateToProps)(LanguageButton)
