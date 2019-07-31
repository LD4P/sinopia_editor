// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'

/**
 * Provides the RFC 5646 language tag for a literal element.
 * See https://tools.ietf.org/html/rfc5646
 * See ISO 639 for the list of registered language codes
 */
const InputLang = (props) => {
  const setPayLoad = selected => props.handleLangChange({
    reduxPath: props.reduxPath,
    lang: selected[0].id,
  })

  return (
    <div>
      <label htmlFor="langComponent">Select language for {props.textValue}
        <Typeahead
          onChange={setPayLoad}
          isLoading={props.loading}
          options={props.options}
          emptyLabel={'retrieving list of languages...'}
          selectHintOnEnter={true}
          id={'langComponent'}
        />
      </label>
    </div>
  )
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
  reduxPath: PropTypes.array.isRequired,
  handleLangChange: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
}

const mapStateToProps = (state, ourProps) => {
  const languages = state.selectorReducer.entities.languages
  const textValue = findNode(state.selectorReducer, ourProps.reduxPath).content
  return {
    textValue,
    options: languages?.options || [],
    loading: languages?.loading || false,
  }
}

export default connect(mapStateToProps, null)(InputLang)
