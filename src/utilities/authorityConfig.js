// Copyright 2019 Stanford University see LICENSE for license

import authorityConfig from "../../static/authorityConfig.json"

const authorityConfigMap = {}
authorityConfig.forEach(
  (configItem) => (authorityConfigMap[configItem.uri] = configItem)
)

export const findAuthorityConfig = (searchUri) => authorityConfigMap[searchUri]

export const sinopiaSearchUri = "urn:ld4p:sinopia"
