// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useLayoutEffect, useState } from "react"
import { Helmet, HelmetProvider } from "react-helmet-async"
import Config from "Config"
import "react-bootstrap-typeahead/css/Typeahead.css"
import PropTypes from "prop-types"
import HomePage from "./home/HomePage"
import "../styles/main.scss"
import Editor from "./editor/Editor"
import Footer from "./Footer"
import Dashboard, { dashboardErrorKey } from "./dashboard/Dashboard"
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import ResourceTemplate, {
  templateErrorKey,
} from "./templates/ResourceTemplate"
import LoadResource from "./load/LoadResource"
import Search from "./search/Search"
import CanvasMenu from "./menu/CanvasMenu"
import Vocab from "./vocabulary/Vocab"
import { useDispatch, useSelector } from "react-redux"
import { fetchGroups } from "actionCreators/groups"
import { fetchLanguages } from "actionCreators/languages"
import { fetchExports } from "actionCreators/exports"
import Exports, { exportsErrorKey } from "./exports/Exports"
import { authenticate } from "actionCreators/authenticate"
import { hasUser as hasUserSelector } from "selectors/authenticate"
import { isModalOpen as isModalOpenSelector } from "selectors/modals"
import {
  newResource as newResourceCreator,
  loadResource,
  dispatchResourceForPreview,
  dispatchResourceForEditor,
} from "actionCreators/resources"
import usePermissions from "hooks/usePermissions"
import { showModal } from "actions/modals"

const FourOhFour = () => <h1>404</h1>

const App = (props) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { canCreate, canEdit } = usePermissions()
  const [isFirstMountWithUser, setFirstMountWithUser] = useState(true)

  const hasUser = useSelector((state) => hasUserSelector(state))
  const isModalOpen = useSelector((state) => isModalOpenSelector(state))

  useEffect(() => {
    dispatch(fetchLanguages())
    dispatch(fetchGroups())
    dispatch(fetchExports(exportsErrorKey))
    dispatch(authenticate())
  }, [dispatch])

  const editorTemplateMatch = useRouteMatch({
    path: "/editor/:templateId",
    exact: true,
  })
  const editorExactMatch = useRouteMatch({ path: "/editor", exact: true })
  const editorResourceMatch = useRouteMatch("/editor/resource/:resourceId")

  useEffect(() => {
    if (isFirstMountWithUser && hasUser) {
      setFirstMountWithUser(false)
      if (editorTemplateMatch) {
        if (canCreate) {
          dispatch(
            newResourceCreator(
              editorTemplateMatch.params.templateId,
              templateErrorKey
            )
          ).then((result) => {
            if (!result) history.push("/templates")
          })
        } else {
          history.push("/dashboard")
        }
      } else if (editorExactMatch) {
        history.push("/dashboard")
      } else if (editorResourceMatch) {
        const uri = `${Config.sinopiaApiBase}/resource/${editorResourceMatch.params.resourceId}`
        dispatch(loadResource(uri, dashboardErrorKey)).then((result) => {
          if (!result) {
            history.push("/dashboard")
            return
          }
          const [, resource] = result
          if (canEdit(resource)) {
            dispatch(dispatchResourceForEditor(result, uri))
          } else {
            dispatch(dispatchResourceForPreview(result))
            dispatch(showModal("PreviewModal"))
            history.push("/dashboard")
          }
        })
      }
    }
  }, [
    hasUser,
    editorExactMatch,
    editorTemplateMatch,
    editorResourceMatch,
    canCreate,
    canEdit,
    history,
    dispatch,
    isFirstMountWithUser,
  ])

  // We do not use standard bootstrap modals (i.e. they are not triggered automatically)
  //  due to complexities in the interaction between JS and React/redux.
  //  This effect is used to prevent scrolling and dim the background behind the modal
  //  which is typically done automatically by bootstrap.
  useLayoutEffect(() => {
    const bodyRoot = document.getElementsByTagName("body")[0]
    if (isModalOpen) {
      // if *any* modals are open, prevent scrolling and dim the background
      bodyRoot.classList.add("modal-open")
    } else {
      bodyRoot.classList.remove("modal-open")
    }
  }, [isModalOpen])

  const routesWithCurrentUser = (
    <Switch>
      <Route
        exact
        path="/"
        render={(renderProps) => (
          <HomePage
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        path="/editor"
        render={(renderProps) => (
          <Editor
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        exact
        path="/templates"
        render={(renderProps) => (
          <ResourceTemplate
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        exact
        path="/search"
        render={(renderProps) => (
          <Search
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        exact
        path="/load"
        render={(renderProps) => (
          <LoadResource
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        exact
        path="/exports"
        render={(renderProps) => (
          <Exports
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        exact
        path="/dashboard"
        render={(renderProps) => (
          <Dashboard
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        path={[
          "/vocabulary/:element/:sub",
          "/vocabulary/:element",
          "/vocabulary",
        ]}
        render={(renderProps) => (
          <Vocab
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        path="/menu"
        render={(renderProps) => <CanvasMenu {...renderProps} />}
      />
      <Route id="404" component={FourOhFour} />
    </Switch>
  )

  const routesWithOutCurrentUser = (
    <Switch>
      <Route
        path={[
          "/vocabulary/:element/:sub",
          "/vocabulary/:element",
          "/vocabulary",
        ]}
        render={(renderProps) => (
          <Vocab
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
      <Route
        render={(renderProps) => (
          <HomePage
            {...renderProps}
            triggerHandleOffsetMenu={props.handleOffsetMenu}
          />
        )}
      />
    </Switch>
  )

  return (
    <HelmetProvider>
      <div id="app">
        <Helmet>
          <title>Sinopia {Config.sinopiaEnv}</title>
        </Helmet>
        {hasUser ? routesWithCurrentUser : routesWithOutCurrentUser}
        <Footer />
      </div>
    </HelmetProvider>
  )
}

App.propTypes = {
  handleOffsetMenu: PropTypes.func,
}

export default App
