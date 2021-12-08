// Copyright 2019 Stanford University see LICENSE for license
import React from "react"
import { useSelector } from "react-redux"
import { selectSearchResults } from "selectors/search"
import ExpandingResourceTemplates from "../templates/ExpandingResourceTemplates"

const TemplateGuessSearchResults = () => {
  const searchResults = useSelector((state) =>
    selectSearchResults(state, "templateguess")
  )

  return (
    <ExpandingResourceTemplates
      id="template-guess"
      label="Template results"
      results={searchResults}
    />
  )
}

export default TemplateGuessSearchResults
