// Copyright 2019 Stanford University see LICENSE for license

import React from "react"
import PropTypes from "prop-types"
import specialcharacters from "../../../../static/specialcharacters.json"

const VocabChoice = (props) => {
  const getOptions = () => {
    const options = []
    Object.keys(specialcharacters).map((key) => {
      options.push(
        <option value={key} key={key}>
          {specialcharacters[key].label}
        </option>
      )
    })
    return options
  }

  const handleChange = (event) => {
    props.selectVocabulary(event)
  }

  return (
    <select
      className="form-control"
      size="10"
      value={props.vocabulary}
      aria-label="Select vocabulary"
      data-testid="Select vocabulary"
      onBlur={handleChange}
      onChange={handleChange}
      onClick={handleChange}
    >
      {getOptions()}
    </select>
  )
}

VocabChoice.propTypes = {
  selectVocabulary: PropTypes.func.isRequired,
  vocabulary: PropTypes.string.isRequired,
}

export default VocabChoice
