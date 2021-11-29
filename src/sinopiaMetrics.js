import Config from "Config"
import { getJson } from "./utilities/SinopiaApiHelper"
import _ from "lodash"

export const getUserCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/userCount`)

export const getTemplateCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/template`)

export const getResourceCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/resource`)

export const getTemplateCreatedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/createdCount/template`,
    compactPick(params, ["startDate", "endDate", "group"])
  )

export const getResourceCreatedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/createdCount/resource`,
    compactPick(params, ["startDate", "endDate", "group"])
  )

const compactPick = (obj, keys) =>
  _.pickBy(
    obj,
    (value, key) =>
      keys.includes(key) && !_.isUndefined(value) && !_.isNull(value)
  )
