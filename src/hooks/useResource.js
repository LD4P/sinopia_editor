import { useLayoutEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { newResource, loadResource } from "actionCreators/resources"
import { selectErrors } from "selectors/errors"
import {
  selectCurrentResourceKey,
  selectNormSubject,
  selectResourceUriMap,
} from "selectors/resources"
import _ from "lodash"
import { showModal } from "actions/modals"
import {
  setCurrentResource,
  setCurrentPreviewResource,
} from "actions/resources"
import { useHistory } from "react-router-dom"

const useResource = (errorKey, errorRef) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const errors = useSelector((state) => selectErrors(state, errorKey))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  const resource = useSelector((state) => selectNormSubject(state, resourceKey))
  // These are resources that are already loaded
  const resourceUriMap = useSelector((state) => selectResourceUriMap(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useLayoutEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resource && _.isEmpty(errors)) {
      if (navigateEditor === "new") {
        history.push(`/editor/${resource.subjectTemplateKey}`)
      } else {
        history.push("/editor")
      }
    } else if (!_.isEmpty(errors) && errorRef) {
      window.scrollTo(0, errorRef.current.offsetTop)
    }
  }, [navigateEditor, resource, history, errors, errorRef])

  const handleNew = (resourceTemplateId, event) => {
    if (event) event.preventDefault()
    dispatch(newResource(resourceTemplateId, errorKey)).then((result) => {
      if (result) setNavigateEditor("new")
    })
  }

  const handleCopy = (resourceURI, event) => {
    if (event) event.preventDefault()
    dispatch(loadResource(resourceURI, errorKey, true)).then((result) => {
      if (result) setNavigateEditor("copy")
    })
  }

  const handleEdit = (resourceURI, event) => {
    if (event) event.preventDefault()
    // Check if already open
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentResource(resourceUriMap[resourceURI]))
      setNavigateEditor("edit")
    } else {
      dispatch(loadResource(resourceURI, errorKey)).then((result) => {
        if (result) setNavigateEditor("edit")
      })
    }
  }

  const handleView = (resourceURI, event) => {
    if (event) event.preventDefault()
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentPreviewResource(resourceUriMap[resourceURI]))
      dispatch(showModal("PreviewModal"))
    } else {
      dispatch(loadResource(resourceURI, errorKey, false, true)).then(() => {
        dispatch(showModal("PreviewModal"))
      })
    }
  }

  return {
    handleNew,
    handleCopy,
    handleEdit,
    handleView,
  }
}

export default useResource
