import { useDispatch, useSelector } from "react-redux"
import { setCurrentComponent } from "actions/index"
import { selectModalType } from "selectors/modals"
import { showNavProperty, hideNavProperty, showNavSubject, hideNavSubject } from "../actions/resources"

const useLeftNav = (navObj) => {
  // navObj can be a subject or property.
  const dispatch = useDispatch()
  const isModalOpen = useSelector((state) => selectModalType(state))
  const isExpanded = navObj.showNav

  const handleNavClick = (event) => {
    event.preventDefault()

    if (isModalOpen) return // do not respond to clicks in the nav if any modal is open

    dispatch(setCurrentComponent(navObj.rootSubjectKey, navObj.rootPropertyKey, navObj.key))
  }

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

  return { handleNavClick, handleToggleClick, isExpanded }
}

export default useLeftNav
