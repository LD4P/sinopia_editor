import { fetchUser, putUserHistory } from "sinopiaApi"
import { selectUser } from "selectors/authenticate"
import {
  loadTemplateHistory,
  loadSearchHistory,
  loadResourceHistory,
} from "actionCreators/history"
import md5 from "crypto-js/md5"

export const loadUserData = (userId) => (dispatch) =>
  fetchUser(userId)
    .then((userData) => {
      const templateIds = userData.data.history.template.map(
        (historyItem) => historyItem.payload
      )
      dispatch(loadTemplateHistory(templateIds))
      const searches = userData.data.history.search.map((historyItem) =>
        JSON.parse(historyItem.payload)
      )
      dispatch(loadSearchHistory(searches))
      const resourceUris = userData.data.history.resource.map(
        (historyItem) => historyItem.payload
      )
      dispatch(loadResourceHistory(resourceUris))
    })
    .catch((err) => console.error(err))

const addHistory = (historyType, payload) => (dispatch, getState) => {
  const user = selectUser(getState())
  if (!user) return
  return putUserHistory(
    user.username,
    historyType,
    md5(payload).toString(),
    payload
  ).catch((err) => console.error(err))
}

export const addTemplateHistory = (templateId) => (dispatch) =>
  dispatch(addHistory("template", templateId))

export const addResourceHistory = (uri) => (dispatch) =>
  dispatch(addHistory("resource", uri))

export const addSearchHistory = (authorityUri, query) => (dispatch) => {
  const payload = JSON.stringify({ authorityUri, query })
  return dispatch(addHistory("search", payload))
}
