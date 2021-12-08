// Copyright 2019 Stanford University see LICENSE for license

import { languagesReceived } from "actions/languages"
import { hasLanguages } from "selectors/languages"
import _ from "lodash"
import isoMapping from "../../static/iso639toBCP47.json"
import Config from "../Config"

export const fetchLanguages = () => (dispatch, getState) => {
  if (hasLanguages(getState())) {
    return // Languages already loaded
  }

  // This speeds up tests.
  if (Config.useLanguageFixtures) {
    return fetchFixtureLanguages(dispatch)
  }

  return import("language-subtag-registry/data/json/registry.json").then(
    (registry) => {
      const typeMap = {
        language: { map: {}, options: [] },
        script: { map: {}, options: [] },
      }
      Object.values(registry).forEach((subtag) => {
        const typeValues = typeMap[subtag.Type]
        if (typeValues) {
          typeValues.map[subtag.Subtag] = subtag.Description[0]
          subtag.Description.forEach((description) => {
            typeValues.options.push({
              id: subtag.Subtag,
              label: `${description} (${subtag.Subtag})`,
            })
          })
        }
      })

      // Add ISO639 values into language map so that these can be displayed.
      Object.entries(isoMapping).forEach(([isoCode, bcp47Code]) => {
        const label = typeMap.language.map[bcp47Code]
        if (label) typeMap.language.map[isoCode] = label
      })

      typeMap.transliteration = {
        map: transliterationMap,
        options: transliterationOptions(),
      }

      Object.values(typeMap).forEach((typeValue) => {
        typeValue.options = _.sortBy(typeValue.options, ["label"])
      })
      dispatch(
        languagesReceived(
          typeMap.language.map,
          typeMap.language.options,
          typeMap.script.map,
          typeMap.script.options,
          typeMap.transliteration.map,
          typeMap.transliteration.options
        )
      )
    }
  )
}

const transliterationMap = {
  alaloc: "American Library Association-Library of Congress",
  buckwalt: "Buckwalter Arabic transliteration system",
  ewts: "Extended Wylie Transliteration Scheme",
  mns: "Mongolian National Standard",
  satts: "Standard Arabic Technical Transliteration System",
  iso: "International Organization for Standardization",
  iast: "International Alphabet of Sanskrit Transliteration",
  pinyin: "Pinyin",
}

const transliterationOptions = () =>
  Object.entries(transliterationMap).map(([subtag, description]) => ({
    id: subtag,
    label: `${description} (${subtag})`,
  }))

const fetchFixtureLanguages = (dispatch) => {
  const languageLookup = [
    { id: "taw", label: "Tai (taw)" },
    { id: "en", label: "English (en)" },
    { id: "zh", label: "Chinese (zh)" },
  ]
  const languages = {
    taw: "Tai",
    en: "English",
    eng: "English",
    zh: "Chinese",
  }
  const scriptLookup = [
    { id: "Adlm", label: "Adlam (Adlm)" },
    { id: "Latn", label: "Latin (Latn)" },
  ]
  const scripts = {
    Adlm: "Adlam",
    Latn: "Latin",
  }
  const transliterationLookup = [
    {
      id: "alaloc",
      label: "American Library Association-Library of Congress (alaloc)",
    },
    {
      id: "buckwalt",
      label: "Buckwalter Arabic transliteration system (buckwalt)",
    },
  ]
  const transliterations = {
    alaloc: "American Library Association-Library of Congress",
    buckwalt: "Buckwalter Arabic transliteration system",
  }

  return dispatch(
    languagesReceived(
      languages,
      languageLookup,
      scripts,
      scriptLookup,
      transliterations,
      transliterationLookup
    )
  )
}

export const noop = () => {}
