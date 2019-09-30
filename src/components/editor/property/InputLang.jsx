// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'
import { languageSelected } from 'actions/index'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/editor/ModalWrapper'
import _ from 'lodash'

/**
 * Provides the RFC 5646 language tag for a literal element.
 * See https://tools.ietf.org/html/rfc5646
 * See ISO 639 for the list of registered language codes
 */
const InputLang = (props) => {
  const [lang, setLang] = useState('')
  const setPayLoad = (selected) => {
    if (selected.length === 1) {
      setLang(selected[0].id)
    } else {
      setLang('')
    }
  }

  const handleLangSubmit = (event) => {
    if (!_.isEmpty(lang)) {
      props.languageSelected({
        reduxPath: props.reduxPath,
        lang,
      })
    }
    event.preventDefault()
  }

  const modal = (
    <React.Fragment>
      <div className="modal" id={props.id}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Languages</h4>
            </div>
            <div className="modal-body">
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
            <div className="modal-footer">
              <button className="btn btn-default" data-dismiss="modal" onClick={handleLangSubmit}>Submit</button>
              <button className="btn btn-default" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )

  return (<ModalWrapper modal={modal} />)
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
  reduxPath: PropTypes.array.isRequired,
  languageSelected: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
  id: PropTypes.string.isRequired,
}

const mapStateToProps = (state, ourProps) => {
  const languages = state.selectorReducer.entities.languages
  const textValue = findNode(state, ourProps.reduxPath).content
  return {
    textValue,
    options: languages?.options || [],
    loading: languages?.loading || false,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ languageSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLang)
