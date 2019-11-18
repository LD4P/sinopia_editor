// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { findNode } from 'selectors/resourceSelectors'
import { modalType } from 'selectors/modalSelectors'
import { languageSelected } from 'actions/index'
import { hideModal } from 'actions/modals'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/ModalWrapper'

/**
 * Provides the RFC 5646 language tag for a literal element.
 * See https://tools.ietf.org/html/rfc5646
 * See ISO 639 for the list of registered language codes
 */
const InputLang = (props) => {
  const [lang, setLang] = useState(props.lang)
  const langPresent = typeof lang !== 'undefined'
  const [languageSelectorEnabled, setLanguageSelectorEnabled] = useState(langPresent)

  const classes = ['modal', 'fade']
  let display = 'none'

  if (props.show) {
    classes.push('show')
    display = 'block'
  }

  const selectLanguage = (selected) => {
    if (selected.length === 1) {
      setLang(selected[0].id)
    } else {
      setLang(undefined)
    }
  }

  const enableLanguageSelector = () => setLanguageSelectorEnabled(true)

  const disableLanguageSelector = () => {
    setLanguageSelectorEnabled(false)
    setLang(undefined)
  }

  const close = (event) => {
    props.hideModal()
    event.preventDefault()
  }

  const handleLangSubmit = (event) => {
    props.languageSelected({
      reduxPath: props.reduxPath,
      lang,
    })
    close(event)
    event.preventDefault()
  }

  const modal = (
    <div className={ classes.join(' ') } style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Languages</h4>
          </div>
          <div className="modal-body">
            <div className="form-check">
              <input type="radio" className="form-check-input" name="lang"
                     id="present" value="present" defaultChecked={langPresent}
                     onChange={enableLanguageSelector} />
              <label className="form-check-label" htmlFor="present">Select language for {props.textValue}
                <Typeahead
                  disabled={!languageSelectorEnabled}
                  onChange={selectLanguage}
                  isLoading={props.loading}
                  options={props.options}
                  emptyLabel={'retrieving list of languages...'}
                  selectHintOnEnter={true}
                  id={'langComponent'}
                />
              </label>
              <p style={{ fontStyle: 'italic', marginTop: '10px' }}>or select</p>
            </div>

            <div className="form-check">
              <input type="radio" className="form-check-input" name="lang"
                     id="absent" value="absent" defaultChecked={!langPresent}
                     onChange={disableLanguageSelector} />
              <label className="form-check-label" htmlFor="absent">No language specified</label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-default" onClick={ handleLangSubmit }>Submit</button>
            <button className="btn btn-default" onClick={ close }>Close</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (<ModalWrapper modal={modal} />)
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
  reduxPath: PropTypes.array.isRequired,
  languageSelected: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  show: PropTypes.bool,
  lang: PropTypes.string,
}

const mapStateToProps = (state, ourProps) => {
  const languages = state.selectorReducer.entities.languages
  const node = findNode(state, ourProps.reduxPath)
  const textValue = node.content
  const lang = node.lang
  const show = modalType(state) === `LanguageModal-${ourProps.reduxPath.join()}`
  return {
    lang,
    textValue,
    options: languages?.options || [],
    loading: languages?.loading || false,
    show,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({ hideModal, languageSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLang)
