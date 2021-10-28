import { useDispatch, useSelector } from "react-redux"
import { clearResource } from "actions/resources"
import { selectResourceKeys } from "selectors/resources"
import { useHistory } from "react-router-dom"

const useEditor = (resourceKey) => {
  const dispatch = useDispatch()
  const history = useHistory()

  const resourceKeyCount = useSelector(
    (state) => selectResourceKeys(state).length
  )

  const handleCloseResource = (event) => {
    if (event) event.preventDefault()

    dispatch(clearResource(resourceKey))
    // If this is the last resource, then return to dashboard.
    if (resourceKeyCount <= 1) history.push("/dashboard")
  }

  return { handleCloseResource }
}

export default useEditor
