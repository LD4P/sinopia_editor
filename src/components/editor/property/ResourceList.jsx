// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getTemplateSearchResults } from 'sinopiaSearch'
import shortid from 'shortid'
import { newResource } from 'actionCreators/resources'
import { selectPropertyTemplate, selectSubjectTemplate } from 'selectors/templates'
import { selectNormSubject } from 'selectors/resources'

export const newResourceErrorKey = 'newresource'

const ResourceList = (props) => {
  const dispatch = useDispatch()
  const [newResourceList, setNewResourceList] = useState([])
  const topRef = useRef(null)

  const propertyTemplate = useSelector((state) => selectPropertyTemplate(state, props.property?.propertyTemplateKey))
  const subject = useSelector((state) => selectNormSubject(state, props.property?.subjectKey))
  const subjectTemplate = useSelector((state) => selectSubjectTemplate(state, subject?.subjectTemplateKey))

  useEffect(() => {
    const handleChange = (resourceTemplateId) => {
      dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
        if (!result) window.scrollTo(0, topRef.current?.offsetTop)
      })
    }
    const getNewResourceList = async () => {
      const listItems = []
      const authorities = propertyTemplate.authorities
      await Promise.all(authorities.map((authority) => getTemplateSearchResults(authority.type).then((response) => {
        if (response.error !== undefined) return ''
        response.results?.forEach((hit) => {
          if (hit.resourceURI === subjectTemplate.class) {
            listItems.push(
              <button className="dropdown-item" href="#" data-resource-id={hit.id} key={shortid.generate()} onClick={() => { handleChange(hit.id) }}>
                {hit.resourceLabel} ({hit.id})
              </button>,
            )
          }
        })
      })))
      setNewResourceList(listItems)
    }
    getNewResourceList()
  }, [dispatch, propertyTemplate.authorities, subjectTemplate.class])

  const dropdown = (items) => <div className="dropdown">
    <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
            aria-haspopup="true" aria-expanded="false">
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
