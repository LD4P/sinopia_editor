// Copyright 2019 Stanford University see LICENSE for license

import React, { Component } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

/**
 * Provides the RFC 5646 language tag for a literal element.
 * See https://tools.ietf.org/html/rfc5646
 * See ISO 639 for the list of registered language codes
 */
class InputLang extends Component {
  setPayLoad(items) {
    const payload = {
      id: this.props.textId,
      reduxPath: this.props.reduxPath,
      lang: items[0],
    }

    this.props.handleLangChange(payload)
  }

  render() {
    return (
      <div>
        <label htmlFor="langComponent">Select language for {this.props.textValue}
          <Typeahead
            onChange={selected => this.setPayLoad(selected)}
            isLoading={this.props.loading}
            options={this.props.options}
            emptyLabel={'retrieving list of languages...'}
            selectHintOnEnter={true}
            id={'langComponent'}
          />
        </label>
      </div>
    )
  }
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
  textId: PropTypes.string.isRequired,
  reduxPath: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  handleLangChange: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
}

const mapStateToProps = (state) => {
  const languages = state.selectorReducer.entities.languages
  return {
    options: languages?.options || [],
    loading: languages?.loading || false,
  }
}

export default connect(mapStateToProps, null)(InputLang)
