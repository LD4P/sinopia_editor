import { useLayoutEffect, useState } from "react"
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

const useResource = (errorKey, errorRef) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const errors = useSelector((state) => selectErrors(state, errorKey))
  const resourceKey = useSelector((state) => selectCurrentResourceKey(state))
  // These are resources that are already loaded
  const resourceUriMap = useSelector((state) => selectResourceUriMap(state))

  const [navigateEditor, setNavigateEditor] = useState(false)

  useLayoutEffect(() => {
    // Forces a wait until the root resource has been set in state
    if (navigateEditor && resourceKey && _.isEmpty(errors)) {
      history.push("/editor")
    } else if (!_.isEmpty(errors) && errorRef) {
      window.scrollTo(0, errorRef.current.offsetTop)
    }
  }, [navigateEditor, resourceKey, history, errors, errorRef])

  const handleNew = (resourceTemplateId, event) => {
    if (event) event.preventDefault()
    dispatch(newResource(resourceTemplateId, errorKey)).then((result) => {
      if (result) setNavigateEditor(true)
    })
  }

  const handleCopy = (resourceURI, event) => {
    if (event) event.preventDefault()
    dispatch(
      loadResourceForEditor(resourceURI, errorKey, { asNewResource: true })
    ).then((result) => {
      if (result) setNavigateEditor(true)
    })
  }

  const handleEdit = (resourceURI, event) => {
    if (event) event.preventDefault()
    // Check if already open
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentResource(resourceUriMap[resourceURI]))
      setNavigateEditor(true)
    } else {
      dispatch(loadResourceForEditor(resourceURI, errorKey)).then((result) => {
        if (result) setNavigateEditor(true)
      })
    }
  }

  const handleView = (resourceURI, event) => {
    if (event) event.preventDefault()
    if (resourceUriMap[resourceURI]) {
      dispatch(setCurrentPreviewResource(resourceUriMap[resourceURI]))
      dispatch(showModal("PreviewModal"))
    } else {
      dispatch(loadResourceForPreview(resourceURI, errorKey)).then(() => {
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
