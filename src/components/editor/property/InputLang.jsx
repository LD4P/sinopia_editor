// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectModalType } from 'selectors/modals'
import { languageSelected } from 'actions/languages'
import { hideModal } from 'actions/modals'
import { bindActionCreators } from 'redux'
import ModalWrapper from 'components/ModalWrapper'
import { selectLanguages, hasLanguages } from 'selectors/languages'

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
    props.languageSelected(props.value.key, lang)
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
                  id="langComponent"
                  inputProps={{ 'data-testid': `langComponent-${props.textValue}` }}
                />
              </label>
              <p style={{ fontStyle: 'italic', marginTop: '10px' }}>or select</p>
            </div>

            <div className="form-check">
              <input type="radio"
                     className="form-check-input"
                     name="lang"
                     id={`noLangRadio-${props.textValue}`}
                     data-testid={`noLangRadio-${props.textValue}`}
                     value="absent"
                     defaultChecked={!langPresent}
                     onChange={disableLanguageSelector} />
              <label className="form-check-label" htmlFor={`noLangRadio-${props.textValue}`}>No language specified</label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={ close }>Cancel</button>
            <button className="btn btn-primary" onClick={ handleLangSubmit } data-testid={`submit-${props.textValue}`}>Submit</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (<ModalWrapper modal={modal} />)
}

InputLang.propTypes = {
  textValue: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  languageSelected: PropTypes.func,
  options: PropTypes.array,
  loading: PropTypes.bool,
  hideModal: PropTypes.func,
  show: PropTypes.bool,
  lang: PropTypes.string,
}

const mapStateToProps = (state, ownProps) => {
  const show = selectModalType(state) === `LanguageModal-${ownProps.value.key}`
  return {
    lang: ownProps.value.lang,
    textValue: ownProps.value.literal,
    options: selectLanguages(state),
    loading: hasLanguages(state),
    show,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({ hideModal, languageSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLang)
