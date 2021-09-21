// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getTemplateSearchResults } from 'sinopiaSearch'
import { nanoid } from 'nanoid'
import { newResource } from 'actionCreators/resources'
import { selectPropertyTemplate, selectSubjectTemplate } from 'selectors/templates'
import { selectCurrentResourceIsReadOnly, selectNormSubject } from 'selectors/resources'
import _ from 'lodash'

export const newResourceErrorKey = 'newresource'

const ResourceList = (props) => {
  const dispatch = useDispatch()
  const [newResourceList, setNewResourceList] = useState([])
  const topRef = useRef(null)
  const readOnly = useSelector((state) => selectCurrentResourceIsReadOnly(state))

  const propertyTemplate = useSelector((state) => selectPropertyTemplate(state, props.property?.propertyTemplateKey))
  const subject = useSelector((state) => selectNormSubject(state, props.property?.subjectKey))
  const subjectTemplate = useSelector((state) => selectSubjectTemplate(state, subject?.subjectTemplateKey))

  useEffect(() => {
    let isMounted = true
    const handleChange = (resourceTemplateId, event) => {
      event.preventDefault()
      dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
        if (!result) window.scrollTo(0, topRef.current?.offsetTop)
      })
    }
    const getNewResourceList = async () => {
      const listItems = []
      const authorities = propertyTemplate.authorities.filter((authority) => authority.uri.startsWith('urn:ld4p:sinopia') && authority.type)
      await Promise.all(authorities.map((authority) => getTemplateSearchResults(authority.type).then((response) => {
        if (response.error) return ''
        response.results?.forEach((hit) => {
          listItems.push(
            <button disabled={readOnly}
                    className="dropdown-item"
                    href="#"
                    data-resource-id={hit.id}
                    key={nanoid()}
                    onClick={(event) => { handleChange(hit.id, event) }}>
              {hit.resourceLabel} ({hit.id})
            </button>,
          )
        })
      })))
      // De-dupicate with lodash
      if (isMounted) setNewResourceList(_.uniq(listItems))
    }
    getNewResourceList()
    return () => { isMounted = false }
  }, [readOnly, dispatch, propertyTemplate.authorities, subjectTemplate.class])

  const dropdown = (items) => <div className="dropdown">
    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false" disabled={readOnly}>
      Create New
    </button>
    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
      {items}
    </div>
  </div>

  if (newResourceList.length < 1) return null

  return (<React.Fragment>{ dropdown(newResourceList) }</React.Fragment>
  )
}

ResourceList.propTypes = {
  property: PropTypes.object.isRequired,
}

export default ResourceList
