const DEFAULT_STATE = {
  formData: []
}

const changeMyItems = (state, action) => {
  let newFormData = state.formData.slice(0)
  let needNewItemArray = true;

  for (let field of newFormData) {
    if (field.id == action.payload.id) {
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

const lookups = (state=DEFAULT_STATE, action) => {
  switch(action.type) {
    case 'CHANGE_SELECTIONS': console.log("lookups change selections");
      return changeMyItems(state, action)
    default:
      return state
  }
}

export default lookups