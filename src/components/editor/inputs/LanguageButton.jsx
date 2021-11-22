// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import { useDispatch, useSelector } from "react-redux"
import InputLang from "./InputLang"
import { showModal } from "actions/modals"
import { selectLanguageLabel } from "selectors/languages"

const LanguageButton = ({ value }) => {
  const dispatch = useDispatch()
  const langLabel = useSelector((state) =>
    selectLanguageLabel(state, value.lang)
  )

  const handleClick = (event) => {
    event.preventDefault()
    dispatch(showModal(`LanguageModal-${value.key}`))
  }

  // const lang = value.lang || "No language specified"
  const label = `Change language for ${value.literal || value.label || ""}`

  return (
    <React.Fragment>
      <button
        id="language"
        onClick={handleClick}
        aria-label={label}
        data-testid={label}
        title={langLabel}
        className="btn btn-link"
      >
        {value.lang || "No language specified"}
      </button>
      <InputLang value={value} />
    </React.Fragment>
  )
}

LanguageButton.propTypes = {
  value: PropTypes.object.isRequired,
}

export default LanguageButton
