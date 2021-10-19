// Copyright 2019 Stanford University see LICENSE for license

import React, { useState } from "react"
import { Typeahead } from "react-bootstrap-typeahead"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { isCurrentModal } from "selectors/modals"
import { languageSelected } from "actions/languages"
import { hideModal } from "actions/modals"
import { bindActionCreators } from "redux"
import ModalWrapper from "components/ModalWrapper"
import { selectLanguages, hasLanguages } from "selectors/languages"

/**
 * Provides the RFC 5646 language tag for a literal element.
 * See https://tools.ietf.org/html/rfc5646
 * See ISO 639 for the list of registered language codes
 */
const InputLang = (props) => {
  const noLangSelected = "absent" // the values of the radio buttons for when a language is selected or not
  const langSelected = "present"

  const [lang, setLang] = useState(props.lang)
  const [submitEnabled, setSubmitEnabled] = useState(true)
  const [radioButtonValue, setRadioButtonValue] = useState(
    props.lang === null ? noLangSelected : langSelected
  )

  const classes = ["modal", "fade"]
  let display = "none"

  if (props.show) {
    classes.push("show")
    display = "block"
  }

  // This function is called when a user picks a language in the type ahead component:
  //  (1) record the radio button checked in state
  //  (2) if a language was selected, set it in state to this value and then select the correct radio button
  //  (3) if no language was selected, set the language in state to null and then select the correct radio button
  const selectLanguage = (selected) => {
    setSubmitEnabled(true)
    if (selected.length === 1) {
      setLang(selected[0].id)
      setRadioButtonValue(langSelected)
    } else {
      setLang(null)
      setRadioButtonValue(noLangSelected)
    }
  }

  // This function is called when a user clicks one of the radio buttons:
  //  (1) select the correct radio button
  //  (2) if they selected the "no language" radio button, set language in state to null
  const handleLanguageRadio = (event) => {
    if (event.target.value === noLangSelected) setLang(null)
    setRadioButtonValue(event.target.value)
  }

  const close = (event) => {
    event.preventDefault()
    props.hideModal()
  }

  const handleLangSubmit = (event) => {
    if (radioButtonValue === langSelected && lang === null) {
      setSubmitEnabled(false)
      return false
    }
    close(event)
    props.languageSelected(props.value.key, lang)
  }

  const modal = (
    <div className={classes.join(" ")} style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Languages</h4>
          </div>
          <div className="modal-body">
            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={langSelected}
                value={langSelected}
                checked={radioButtonValue === langSelected}
                onChange={handleLanguageRadio}
              />
              <label className="form-check-label" htmlFor={langSelected}>
                Select language for {props.textValue}
                <Typeahead
                  disabled={radioButtonValue === noLangSelected}
                  onChange={selectLanguage}
                  isLoading={props.loading}
                  options={props.options}
                  emptyLabel={"retrieving list of languages..."}
                  id="langComponent"
                  inputProps={{
                    "data-testid": `langComponent-${props.textValue}`,
                  }}
                />
              </label>
              <p style={{ fontStyle: "italic", marginTop: "10px" }}>
                or select
              </p>
            </div>

            <div className="form-check">
              <input
                type="radio"
                className="form-check-input"
                id={`noLangRadio-${props.textValue}`}
                data-testid={`noLangRadio-${props.textValue}`}
                value={noLangSelected}
                checked={radioButtonValue === noLangSelected}
                onChange={handleLanguageRadio}
              />
              <label
                className="form-check-label"
                htmlFor={`noLangRadio-${props.textValue}`}
              >
                No language specified
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={close}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleLangSubmit}
              data-testid={`submit-${props.textValue}`}
              disabled={!submitEnabled}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return <ModalWrapper modal={modal} />
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
  const show = isCurrentModal(state, `LanguageModal-${ownProps.value.key}`)
  return {
    lang: ownProps.value.lang,
    textValue: ownProps.value.literal || ownProps.value.label || "",
    options: selectLanguages(state),
    loading: hasLanguages(state),
    show,
  }
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ hideModal, languageSelected }, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(InputLang)
