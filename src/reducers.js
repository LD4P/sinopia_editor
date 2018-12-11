import { SET_ITEMS } from './actions'

const DEFAULT_STATE = {
  formData: [
    {
      id: "Statement of Responsibility Relating to Title Proper (RDA 2.4.2)",
      items: [
        {content:"food", id: 10},
        {content:"bar", id: 11}
      ]
    }
  ]
}

const setMyItems = (state, action) => {
  let newFormData = state.formData.slice(0)
  let needNewItemArray = true;

  for (let field of newFormData) {
    if (field.id == action.payload.id) {
      field.items = field.items.concat(action.payload.items)
      needNewItemArray = false;
      break;
    }
  }

  if (needNewItemArray) {
      newFormData.push(action.payload)
  }
  console.log("formdata", newFormData)
  return {formData: newFormData}
}


const rootReducer = (state = DEFAULT_STATE, action) => {
  switch(action.type) {
    case SET_ITEMS:
      return setMyItems(state, action)
    default:
      return state
  }
}

export default rootReducer
