import { fetchUser, putUserHistory } from 'sinopiaApi'
import { selectUser } from 'selectors/authenticate'
import { loadTemplateHistory } from 'actionCreators/templates'
import md5 from 'crypto-js/md5'

export const loadUserData = (userId) => (dispatch) => fetchUser(userId)
  .then((userData) => {
    const templateIds = userData.data.history.template.map((historyItem) => historyItem.payload)
    dispatch(loadTemplateHistory(templateIds))
  })
  .catch((err) => console.error(err))

const addHistory = (historyType, payload) => (dispatch, getState) => {
  const user = selectUser(getState())
  if (!user) return
  return putUserHistory(user.username, historyType, md5(payload).toString(), payload)
    .catch((err) => console.error(err))
}

export const addTemplateHistory = (templateId) => (dispatch) => dispatch(addHistory('template', templateId))

export const addResourceHistory = (uri) => (dispatch) => dispatch(addHistory('resource', uri))

export const addSearchHistory = (authorityUri, query) => (dispatch) => {
  const payload = JSON.stringify({ authorityUri, query })
  return dispatch(addHistory('search', payload))
}
