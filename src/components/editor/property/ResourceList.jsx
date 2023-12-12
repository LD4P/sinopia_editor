// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { getTemplateSearchResults } from "sinopiaSearch"
import { nanoid } from "nanoid"
import { newResource, addMainTitle } from "actionCreators/resources"
import {
  selectPropertyTemplate,
  selectSubjectTemplate,
} from "selectors/templates"
import { selectNormSubject, selectMainTitleValue } from "selectors/resources"
import { setCurrentResource } from "actions/resources"

import useAlerts from "hooks/useAlerts"
import _ from "lodash"

const ResourceList = (props) => {
  const dispatch = useDispatch()
  const [newResourceList, setNewResourceList] = useState([])
  const errorKey = useAlerts()
  const topRef = useRef(null)

  const propertyTemplate = useSelector((state) =>
    selectPropertyTemplate(state, props.property?.propertyTemplateKey)
  )
  const subject = useSelector((state) =>
    selectNormSubject(state, props.property?.subjectKey)
  )
  const subjectTemplate = useSelector((state) =>
    selectSubjectTemplate(state, subject?.subjectTemplateKey)
  )

  const mainTitleValue = useSelector((state) =>
    selectMainTitleValue(state, props.property?.rootSubjectKey)
  )

  useEffect(() => {
    let isMounted = true
    const handleChange = (resourceTemplateId, event) => {
      event.preventDefault()
      dispatch(newResource(resourceTemplateId, errorKey, false)).then(
        (resourceKey) => {
          if (resourceKey && mainTitleValue) {
            dispatch(addMainTitle(resourceKey, mainTitleValue))
          }
          if (resourceKey) {
            dispatch(setCurrentResource(resourceKey))
          } else {
            window.scrollTo(0, topRef.current?.offsetTop)
          }
        }
      )
    }
    const getNewResourceList = async () => {
      const listItems = []
      const authorities = propertyTemplate.authorities.filter(
        (authority) =>
          authority.uri.startsWith("urn:ld4p:sinopia") && authority.type
      )
      await Promise.all(
        authorities.map((authority) =>
          getTemplateSearchResults(authority.type).then((response) => {
            if (response.error) return ""
            response.results?.forEach((hit) => {
              listItems.push(
                <button
                  className="dropdown-item"
                  href="#"
                  data-resource-id={hit.id}
                  key={nanoid()}
                  onClick={(event) => {
                    handleChange(hit.id, event)
                  }}
                >
                  {hit.resourceLabel} ({hit.id})
                </button>
              )
            })
          })
        )
      )
      // De-dupicate with lodash
      if (isMounted) setNewResourceList(_.uniq(listItems))
    }
    getNewResourceList()
    return () => {
      isMounted = false
    }
  }, [
    dispatch,
    propertyTemplate.authorities,
    subjectTemplate.class,
    errorKey,
    mainTitleValue,
  ])

  const dropdown = (items) => (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle mb-1"
        type="button"
        id="dropdownMenuButton"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        Create New
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {items}
      </div>
    </div>
  )

  if (newResourceList.length < 1) return null

  return <React.Fragment>{dropdown(newResourceList)}</React.Fragment>
}

ResourceList.propTypes = {
  property: PropTypes.object.isRequired,
}

export default ResourceList
