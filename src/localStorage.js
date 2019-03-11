export const loadState = (stored) => {
  try {
    const serializedState = localStorage.getItem(stored)
    if (serializedState === null) {
      return undefined
    } else {
      return JSON.parse(serializedState)
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