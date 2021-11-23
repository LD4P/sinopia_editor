import Config from "Config"
import { getJson } from "./utilities/SinopiaApiHelper"

export const getUserCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/userCount`)

export const getTemplateCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/template`)

export const getResourceCount = () =>
  getJson(`${Config.sinopiaApiBase}/metrics/resourceCount/resource`)
