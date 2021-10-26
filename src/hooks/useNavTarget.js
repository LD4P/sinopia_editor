import { useEffect } from "react"
import { setCurrentComponent } from "actions/index"
import { useDispatch, useSelector } from "react-redux"
import { isCurrentComponent as isCurrentComponentSelector } from "selectors/index"
import { isInViewport } from "utilities/Utilities"

const useNavTarget = (navObj) => {
  const dispatch = useDispatch()

  const isCurrentComponent = useSelector((state) =>
    isCurrentComponentSelector(state, navObj.rootSubjectKey, navObj.key)
  )

  const navTargetId = `navTarget-${navObj.key}`

  // This causes the component to scroll into view when first mounted if current component.
  useEffect(() => {
    if (!isCurrentComponent) return

    const elem = document.querySelector(`#${navTargetId}`)
    if (!isInViewport(elem)) elem.scrollIntoView()
    // This is only on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNavTargetClick = (event) => {
    dispatch(
      setCurrentComponent(
        navObj.rootSubjectKey,
        navObj.rootPropertyKey,
        navObj.key
      )
    )
    event.stopPropagation()
  }

  return { navTargetId, handleNavTargetClick }
}

export default useNavTarget
