// Copyright 2019 Stanford University see LICENSE for license

import authorityConfig from '../../static/authorityConfig.json'

export const findAuthorityConfig = searchUri => authorityConfig.find(configItem => configItem.uri === searchUri)

export const findAuthorityConfigs = searchUris => authorityConfig.filter(configItem => searchUris.includes(configItem.uri))
