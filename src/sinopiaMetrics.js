import Config from "Config"
import { getJson } from "./utilities/SinopiaApiHelper"
import _ from "lodash"

export const getUserCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/userCount`)

export const getTemplateCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/template`)

export const getResourceCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/resource`)

const dateGroupFields = ["startDate", "endDate", "group"]

export const getTemplateCreatedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/createdCount/template`,
    compactPick(params, dateGroupFields)
  )

export const getResourceCreatedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/createdCount/resource`,
    compactPick(params, dateGroupFields)
  )

export const getTemplateEditedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/editedCount/template`,
    compactPick(params, dateGroupFields)
  )

export const getResourceEditedCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/editedCount/resource`,
    compactPick(params, dateGroupFields)
  )

export const getTemplateUsageCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/templateUsageCount`,
    compactPick(params, ["templateId"])
  )

export const getResourceUserCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/resourceUserCount/resource`,
    compactPick(params, dateGroupFields)
  )

export const getTemplateUserCount = (params) =>
  getJson(
    `${Config.sinopiaApiBase}/metrics/resourceUserCount/template`,
    compactPick(params, dateGroupFields)
  )

const compactPick = (obj, keys) =>
  _.pickBy(
    obj,
    (value, key) =>
      keys.includes(key) && !_.isUndefined(value) && !_.isNull(value)
  )
