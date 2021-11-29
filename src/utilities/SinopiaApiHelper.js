import Config from "../Config"
import Auth from "@aws-amplify/auth"
import _ from "lodash"

export const checkResp = (resp) => {
  if (resp.ok) return Promise.resolve(resp)
  return resp
    .json()
    .then((errors) => {
      // Assuming only one for now.
      const error = errors[0]
      const newError = error.details
        ? new Error(`${error.title}: ${error.details}`)
        : new Error(`${error.title}`)
      newError.name = "ApiError"
      throw newError
    })
    .catch((err) => {
      if (err.name === "ApiError") throw err
      throw new Error(`Sinopia API returned ${resp.statusText}`)
    })
}

export const getJson = (url, queryParams = {}) =>
  fetch(urlWithQueryString(url, queryParams), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })
    .then((resp) => checkResp(resp))
    .then((resp) => resp.json())

const urlWithQueryString = (url, queryParams) => {
  if (_.isEmpty(queryParams)) return url

  return `${url}?${new URLSearchParams(queryParams)}`
}

export const getJsonData = (url) => getJson(url).then((json) => json.data)

export const isTemplate = (resource) =>
  resource.subjectTemplate.id === Config.rootResourceTemplateId

export const templateIdFor = (resource) => {
  const resourceIdProperty = resource.properties.find(
    (property) =>
      property.propertyTemplate.defaultUri ===
      "http://sinopia.io/vocabulary/hasResourceId"
  )
  return resourceIdProperty.values[0].literal
}

export const getJwt = () =>
  Auth.currentSession()
    .then((data) => {
      if (!data.idToken.jwtToken) throw new Error("jwt is undefined")
      return data.idToken.jwtToken
    })
    .catch((err) => {
      if (err) throw err
      throw new Error("Error getting current authentication session")
    })
