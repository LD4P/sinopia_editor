import { pretty } from "./matcherUtils"
import _ from "lodash"

expect.extend({
  toHaveAction(actions, actionType, payload) {
    if (typeof actionType !== "string") {
      throw new Error("expected actionType to be a string")
    }

    if (
      actions.findIndex((action) => {
        if (action.type !== actionType) return false
        if (!payload) return true
        return _.isEqual(payload, action.payload)
      }) === -1
    ) {
      return {
        pass: false,
        message: () => formatMsg(actions, actionType, payload, false),
      }
    }

    return {
      pass: true,
      message: () => formatMsg(actions, actionType, payload, true),
    }
  },
})

const formatMsg = (actions, actionType, payload, notToHave) => {
  let msg = `Expected ${pretty(actions)}`
  if (notToHave) msg = `${msg} not`
  msg = `${msg} to have ${actionType}`
  if (payload) msg = `${msg} with payload ${pretty(payload)}`
  return msg
}
