import { useDispatch, useSelector } from "react-redux"
import { setCurrentComponent } from "actions/index"
import { selectModalType } from "selectors/modals"

const useLeftNav = (property) => {
  const isModalOpen = useSelector((state) => selectModalType(state))
  const dispatch = useDispatch()

  const handleClick = (event) => {
    event.preventDefault()

    if (isModalOpen) return // do not respond to clicks in the nav if any modal is open

    dispatch(
      setCurrentComponent(
        property.rootSubjectKey,
        property.rootPropertyKey,
        property.key
      )
    )
  }

  return handleClick
}

export default useLeftNav
