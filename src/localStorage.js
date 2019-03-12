export const loadState = (stored) => {
  try {
    const serializedState = localStorage.getItem(stored)
    if (serializedState === null) {
      return undefined
    } else {
      let state = JSON.parse(serializedState)

      let time = new Date()
      const expires = time.setSeconds(time.getSeconds())

      if (expires > state.expiry) {
        state = undefined
      }
      return state
    }
  } catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    localStorage.setItem('jwtAuth', serializedState)
  } catch (err) {
    // Ignore write errors
  }
}

export const clearState = () => {
  try {
    localStorage.removeItem('jwtAuth')
  } catch (err) {
    // Ignore write errors
  }
}