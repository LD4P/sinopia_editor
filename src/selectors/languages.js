// Copyright 2019 Stanford University see LICENSE for license
import { parseLangTag } from "utilities/Language"
import { selectNormSubject } from "./resources"

export const selectLanguageLabel = (state, tag) => {
  if (!tag) return "No language specified"
  // Cheat.
  if (tag === "en") return "English"

  const [langSubtag, scriptSubtag, transliterationSubtag] = parseLangTag(tag)
  const labels = [
    state.entities.languages[langSubtag] || `Unknown language (${langSubtag})`,
  ]
  if (scriptSubtag)
    labels.push(
      state.entities.scripts[scriptSubtag] || `Unknown script (${scriptSubtag})`
    )
  if (transliterationSubtag)
    labels.push(
      state.entities.transliterations[transliterationSubtag] ||
        `Unknown transliteration (${transliterationSubtag})`
    )
  return labels.join(" - ")
}

export const hasLanguages = (state) => {
  state.entities.languages.length > 0
}

export const selectLanguages = (state) => state.entities.languageLookup

export const selectScripts = (state) => state.entities.scriptLookup

export const selectTransliterations = (state) =>
  state.entities.transliterationLookup

export const selectDefaultLang = (state, resourceKey) =>
  selectNormSubject(state, resourceKey)?.defaultLang
