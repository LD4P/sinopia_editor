// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import PropTypes from 'prop-types'
import specialcharacters from '../../../../static/specialcharacters.json'

const VocabChoice = (props) => {
  const getOptions = () => {
    const options = []
    Object.keys(specialcharacters).map((key) => {
      options.push(<option value={key} key={key}>{specialcharacters[key].label}</option>)
    })
    return options
  }

  return (<select className="form-control" size="10" onClick={(event) => props.selectVocabulary(event)}>{getOptions()}</select>)
}

VocabChoice.propTypes = {
  selectVocabulary: PropTypes.func,
}

export default VocabChoice
