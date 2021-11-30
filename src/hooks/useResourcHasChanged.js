import { useRef, useEffect } from "react"
import { useDispatch } from "react-redux"
import { setResourceChanged } from "actions/resources"

const useResourceHasChanged = (value) => {
  const dispatch = useDispatch()

  // This indicates whether on a SET_RESOURCE_CHANGED has been dispatched.
  // Using a ref for this because don't want to trigger rerender when changes.
  const hasDispatchedChanged = useRef(false)

  useEffect(() => {
    hasDispatchedChanged.current = false
  }, [value])

  const handleKeyDown = () => {
    if (!hasDispatchedChanged.current) {
      dispatch(setResourceChanged(value.rootSubjectKey))
      hasDispatchedChanged.current = true
    }
  }

  return handleKeyDown
}

export default useResourceHasChanged
