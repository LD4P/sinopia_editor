// Copyright 2020 Stanford University see LICENSE for license

import Config from "Config"

export const defaultSearchResultsPerPage = (searchType) =>
  searchType === "template"
    ? Config.templateSearchResultsPerPage
    : Config.searchResultsPerPage

export const noop = () => {}
