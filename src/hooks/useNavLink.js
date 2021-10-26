import { useEffect } from "react"
import { setCurrentComponent } from "actions/index"
import { useDispatch, useSelector } from "react-redux"
import {
  isCurrentProperty as isCurrentPropertySelector,
  isCurrentComponent as isCurrentComponentSelector,
} from "selectors/index"
import { isInViewport } from "utilities/Utilities"

const useNavLink = (navObj) => {
  const dispatch = useDispatch()

  const isCurrentProperty = useSelector((state) =>
    isCurrentPropertySelector(
      state,
      navObj.rootSubjectKey,
      navObj.rootPropertyKey
    )
  )
  const isCurrentComponent = useSelector((state) =>
    isCurrentComponentSelector(state, navObj.rootSubjectKey, navObj.key)
  )
  const navLinkId = `navLink-${navObj.key}`
  const navTargetId = `navTarget-${navObj.key}`

  // This causes the component to scroll into view when first mounted if current component.
  useEffect(() => {
    if (!isCurrentComponent) return

    const elem = document.querySelector(`#${navLinkId}`)
    if (!isInViewport(elem)) elem.scrollIntoView()
    // This is only on initial mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNavLinkClick = (event) => {
    event.preventDefault()

    const elem = document.querySelector(`#${navTargetId}`)
    if (!isInViewport(elem)) elem.scrollIntoView({ behavior: "smooth" })
    dispatch(
      setCurrentComponent(
        navObj.rootSubjectKey,
        navObj.rootPropertyKey,
        navObj.key
      )
    )
  }

  return { navLinkId, handleNavLinkClick, isCurrentProperty }
}

export default useNavLink
