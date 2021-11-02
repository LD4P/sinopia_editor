import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  newResource,
  loadResourceForEditor,
  loadResourceForPreview,
} from "actionCreators/resources"
import { selectErrors } from "selectors/errors"
import {
  selectCurrentResourceKey,
  selectResourceUriMap,
} from "selectors/resources"
import _ from "lodash"
import { showModal } from "actions/modals"
import {
  setCurrentResource,
  setCurrentPreviewResource,
} from "actions/resources"
import { useHistory } from "react-router-dom"

const useResource = (
  errorKey,
  { resourceTemplateId = null, resourceURI = null }
) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const errors = useSelector((state) => selectErrors(state, errorKey))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  // These are resources that are already loaded
  const resourceUriMap = useSelector((state) => selectResourceUriMap(state))

  const [navigateEditor, setNavigateEditor] = useState(false)
  const [status, setStatus] = useState("ready")

  useEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resourceKey && _.isEmpty(errors)) {
      history.push("/editor")
    }
  }, [navigateEditor, resourceKey, history, errors])

  const handleNew = (event) => {
    if (event) event.preventDefault()
    setStatus("loading new")
    dispatch(newResource(resourceTemplateId, errorKey)).then((result) => {
      setStatus("ready")
      if (result) setNavigateEditor(true)
    })
  }

  const handleCopy = (event) => {
    if (event) event.preventDefault()
    setStatus("loading copy")
    dispatch(
      loadResourceForEditor(resourceURI, errorKey, { asNewResource: true })
    ).then((result) => {
      setStatus("ready")
      if (result) setNavigateEditor(true)
    })
  }

  const handleEdit = (event) => {
    if (event) event.preventDefault()
    // Check if already open
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentResource(resourceUriMap[resourceURI]))
      setNavigateEditor(true)
    } else {
      setStatus("loading edit")
      dispatch(loadResourceForEditor(resourceURI, errorKey)).then((result) => {
        setStatus("ready")
        if (result) setNavigateEditor(true)
      })
    }
  }

  const handleView = (event) => {
    if (event) event.preventDefault()
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentPreviewResource(resourceUriMap[resourceURI]))
      dispatch(showModal("PreviewModal"))
    } else {
      setStatus("loading view")
      dispatch(loadResourceForPreview(resourceURI, errorKey)).then(() => {
        setStatus("ready")
        dispatch(showModal("PreviewModal"))
      })
    }
  }

  return {
    handleNew,
    handleCopy,
    handleEdit,
    handleView,
    isLoadingNew: status === "loading new",
    isLoadingCopy: status === "loading copy",
    isLoadingEdit: status === "loading edit",
    isLoadingView: status === "loading view",
  }
}

export default useResource
