export const groupsReceived = (state, action) => ({
  ...state,
  groups: action.payload,
  groupMap: createGroupMap(action.payload),
})

export const createGroupMap = (groupList) => {
  const groupMap = {}
  groupList.forEach((group) => (groupMap[group.id] = group.label))
  return groupMap
}

export const noop = () => {}
