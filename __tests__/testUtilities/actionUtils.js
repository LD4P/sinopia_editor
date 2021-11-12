import _ from "lodash"

// This removes circular references.
export const safeAction = (action) => JSON.parse(JSON.safeStringify(action))

export const cloneAddResourceActionAsNewResource = (addResourceAction) => {
  const clonedAction = _.cloneDeep(addResourceAction)

  clonedAction.payload.uri = null
  clonedAction.payload.group = null
  clonedAction.payload.editGroups = []

  return clonedAction
}
