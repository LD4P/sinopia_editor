const DEFAULT_STATE = {
  formData: []
}

const setMyItems = (state, action) => {
  let newFormData = state.formData.slice(0)
  let needNewItemArray = true;

  for (let field of newFormData) {
    if (newFormData.length === 0 || field.id === action.payload.id) {
      field.items = action.payload.items
      needNewItemArray = false;
      break;
    }
  }

  if (needNewItemArray) {
    newFormData.push(action.payload)
  }
  return {formData: newFormData}
}

const lang = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'SET_LANG':
      return setMyItems(state, action)
    default:
      return state
  }
}

export default lang