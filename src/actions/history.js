export const addTemplateHistory = (resourceTemplate) => ({
  type: "ADD_TEMPLATE_HISTORY",
  payload: resourceTemplate,
})

export const addTemplateHistoryByResult = (result) => ({
  type: "ADD_TEMPLATE_HISTORY_BY_RESULT",
  payload: result,
})

export const addSearchHistory = (authorityUri, authorityLabel, query) => ({
  type: "ADD_SEARCH_HISTORY",
  payload: { authorityUri, authorityLabel, query },
})

export const addResourceHistory = (resourceUri, type, group, modified) => ({
  type: "ADD_RESOURCE_HISTORY",
  payload: {
    resourceUri,
    type,
    group,
    modified,
  },
})

export const addResourceHistoryByResult = (result) => ({
  type: "ADD_RESOURCE_HISTORY_BY_RESULT",
  payload: result,
})
