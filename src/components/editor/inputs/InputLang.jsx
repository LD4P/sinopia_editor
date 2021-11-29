// Copyright 2019 Stanford University see LICENSE for license

import React, { useState, useEffect } from "react"
import { Typeahead } from "react-bootstrap-typeahead"
import { useSelector, useDispatch } from "react-redux"
import { isCurrentModal, selectCurrentLangModalValue } from "selectors/modals"
import { languageSelected, setDefaultLang } from "actions/languages"
import { hideModal } from "actions/modals"
import ModalWrapper from "components/ModalWrapper"
import {
  selectLanguages,
  selectScripts,
  selectTransliterations,
  selectDefaultLang,
} from "selectors/languages"
import { selectNormValue } from "selectors/resources"
import { parseLangTag, stringifyLangTag } from "utilities/Language"
import _ from "lodash"

const InputLang = () => {
  const dispatch = useDispatch()
  const show = useSelector((state) => isCurrentModal(state, `LangModal`))
  const valueKey = useSelector((state) => selectCurrentLangModalValue(state))
  const value = useSelector((state) => selectNormValue(state, valueKey))
  const langOptions = useSelector((state) => selectLanguages(state))
  const scriptOptions = useSelector((state) => selectScripts(state))
  const transliterationOptions = useSelector((state) =>
    selectTransliterations(state)
  )
  const resourceDefaultLang = useSelector((state) =>
    selectDefaultLang(state, value?.rootSubjectKey)
  )
  const textValue = value?.literal || value?.label || ""
  const [selectedLangOptions, setSelectedLanguageOptions] = useState([])
  const [selectedScriptOptions, setSelectedScriptOptions] = useState([])
  const [selectedTransliterationOptions, setSelectedTransliterationOptions] =
    useState([])
  const [isDefaultLang, setIsDefaultLang] = useState(false)

  const newTag = stringifyLangTag(
    _.first(selectedLangOptions)?.id,
    _.first(selectedScriptOptions)?.id,
    _.first(selectedTransliterationOptions)?.id
  )

  const showDefaultLang = resourceDefaultLang !== newTag

  useEffect(() => {
    setIsDefaultLang(false)
    if (!value?.lang) return
    const [langSubtag, scriptSubtag, transliterationSubtag] = parseLangTag(
      value.lang
    )

    const newLangOptions = findOptions(langSubtag, langOptions)
    if (!newLangOptions) return

    setSelectedLanguageOptions(newLangOptions)
    const newScriptOptions = findOptions(scriptSubtag, scriptOptions)
    if (newScriptOptions) setSelectedScriptOptions(newScriptOptions)

    const newTransliterationOptions = findOptions(
      transliterationSubtag,
      transliterationOptions
    )
    if (newTransliterationOptions)
      setSelectedTransliterationOptions(newTransliterationOptions)
  }, [value, langOptions, scriptOptions, transliterationOptions])

  const findOptions = (id, options) => {
    if (!id) return []
    const option = options.find((option) => option.id === id)

    return option ? [option] : []
  }

  const classes = ["modal", "fade"]
  let display = "none"

  if (show) {
    classes.push("show")
    display = "block"
  }

  const handleLangChange = (selected) => {
    setSelectedLanguageOptions(selected)
    if (_.isEmpty(selected)) {
      setSelectedScriptOptions([])
      setSelectedTransliterationOptions([])
    }
  }

  const handleScriptChange = (selected) => {
    setSelectedScriptOptions(selected)
  }

  const handleTransliterationChange = (selected) => {
    setSelectedTransliterationOptions(selected)
  }

  const close = (event) => {
    event.preventDefault()
    dispatch(hideModal())
  }

  const handleLangSubmit = (event) => {
    close(event)
    dispatch(languageSelected(value.key, newTag))
    if (isDefaultLang) dispatch(setDefaultLang(value.rootSubjectKey, newTag))
  }

  const handleDefaultLangClick = () => {
    setIsDefaultLang(!isDefaultLang)
  }

  const modal = (
    <div className={classes.join(" ")} style={{ display }}>
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title">Select language tag for {textValue}</h4>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-3">Current tag:</div>
              <div className="col-sm-9">{value?.lang || "None specified"}</div>
            </div>
            <div className="row">
              <div className="col-sm-3">New tag:</div>
              <div className="col-sm-9">{newTag || "None specified"}</div>
            </div>
            <div className="row mb-4">
              <div className="col-sm-3"></div>
              <div className="col-sm-9">
                {showDefaultLang && (
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={isDefaultLang}
                      id="defaultLang"
                      onChange={handleDefaultLangClick}
                    />
                    <label className="form-check-label" htmlFor="defaultLang">
                      Make default for resource.
                    </label>
                  </div>
                )}
              </div>
            </div>
            <div className="row mb-1">
              <label
                className="col-sm-3 col-form-label"
                htmlFor="langComponent"
              >
                Language:
              </label>
              <div className="col-sm-9">
                <div className="input-group">
                  <Typeahead
                    onChange={handleLangChange}
                    isLoading={_.isEmpty(langOptions)}
                    options={langOptions}
                    emptyLabel={"retrieving list of languages..."}
                    placeholder="None specified"
                    id="langComponent"
                    selected={selectedLangOptions}
                    inputProps={{
                      "data-testid": `langComponent-${textValue}`,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-lang-clear"
                    onClick={() => handleLangChange([])}
                    aria-label={`Clear language for ${textValue}`}
                    data-testid={`Clear language for ${textValue}`}
                    title="Clear language"
                  ></button>
                </div>
              </div>
            </div>
            <div className="row mb-1">
              <label
                className="col-sm-3 col-form-label"
                htmlFor="scriptComponent"
              >
                Script:
              </label>
              <div className="col-sm-9">
                <div className="input-group">
                  <Typeahead
                    onChange={handleScriptChange}
                    isLoading={_.isEmpty(scriptOptions)}
                    disabled={_.isEmpty(selectedLangOptions)}
                    options={scriptOptions}
                    emptyLabel={"retrieving list of scripts..."}
                    placeholder="None specified"
                    id="scriptComponent"
                    selected={selectedScriptOptions}
                    inputProps={{
                      "data-testid": `scriptComponent-${textValue}`,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-lang-clear"
                    onClick={() => handleScriptChange([])}
                    aria-label={`Clear script for ${textValue}`}
                    data-testid={`Clear script for ${textValue}`}
                    title="Clear script"
                  ></button>
                </div>
              </div>
            </div>
            <div className="row">
              <label
                className="col-sm-3 col-form-label"
                htmlFor="transliterationComponent"
              >
                Transliteration:
              </label>
              <div className="col-sm-9">
                <div className="input-group">
                  <Typeahead
                    onChange={handleTransliterationChange}
                    isLoading={_.isEmpty(transliterationOptions)}
                    disabled={_.isEmpty(selectedLangOptions)}
                    options={transliterationOptions}
                    emptyLabel={"retrieving list of transliterations..."}
                    placeholder="None specified"
                    id="transliterationComponent"
                    selected={selectedTransliterationOptions}
                    inputProps={{
                      "data-testid": `transliterationComponent-${textValue}`,
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-lang-clear"
                    onClick={() => handleTransliterationChange([])}
                    aria-label={`Clear transliteration for ${textValue}`}
                    data-testid={`Clear transliteration for ${textValue}`}
                    title="Clear transliteration"
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-link" onClick={close}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleLangSubmit}
              data-testid={`Select language for ${textValue}`}
              aria-label={`Select language for ${textValue}`}
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

export default InputLang
