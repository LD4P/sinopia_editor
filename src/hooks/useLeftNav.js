import { useDispatch } from "react-redux"
import {
  showNavProperty,
  hideNavProperty,
  showNavSubject,
  hideNavSubject,
} from "actions/resources"

const useLeftNav = (navObj) => {
  // navObj can be a subject or property.
  const dispatch = useDispatch()
  const isExpanded = navObj.showNav

  const handleToggleClick = (event) => {
    event.preventDefault()

    if (navObj.subjectTemplateKey) {
      if (isExpanded) {
        dispatch(hideNavSubject(navObj.key))
      } else {
        dispatch(showNavSubject(navObj.key))
      }
    } else if (isExpanded) {
      dispatch(hideNavProperty(navObj.key))
    } else {
      dispatch(showNavProperty(navObj.key))
    }
  }

  return { handleToggleClick, isExpanded }
}

export default useLeftNav
