// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, connect } from "react-redux"
import InputLang from "./InputLang"
import { showModal } from "actions/modals"
import { selectLanguageLabel } from "selectors/languages"

const LanguageButton = (props) => {
  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal(`LanguageModal-${props.value.key}`))
  }

  const languageLabel = props.language || "No language specified"
  const label = `Change language for ${
    props.value.literal || props.value.label || ""
  }`

  return (
    <React.Fragment>
      <button
        id="language"
        onClick={handleClick}
        aria-label={label}
        data-testid={label}
        className="btn btn-link"
      >
        {languageLabel}
      </button>
      <InputLang value={props.value} />
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  value: PropTypes.object.isRequired,
  language: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  language: selectLanguageLabel(state, ownProps.value.lang),
})

export default connect(mapStateToProps)(LanguageButton)
