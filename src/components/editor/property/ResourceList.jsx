// Copyright 2019 Stanford University see LICENSE for license

import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { getTemplateSearchResults } from 'sinopiaSearch'
import shortid from 'shortid'
import { newResource } from 'actionCreators/resources'
import { findAuthorityConfigs } from 'utilities/authorityConfig'
import { getPropertyTemplate } from 'selectors/resourceSelectors'

export const newResourceErrorKey = 'newresource'

const ResourceList = (props) => {
  const dispatch = useDispatch()
  const [newResourceList, setNewResourceList] = useState([])
  const rtAndProp = props.reduxPath.slice(-2)
  const property = useSelector(state => getPropertyTemplate(state, rtAndProp[0], rtAndProp[1]))
  const topRef = useRef(null)

  useEffect(() => {
    const handleChange = (resourceTemplateId) => {
      dispatch(newResource(resourceTemplateId, newResourceErrorKey)).then((result) => {
        if (!result) window.scrollTo(0, topRef.current?.offsetTop)
      })
    }
    const getNewResourceList = async () => {
      const listItems = []
      const authorities = findAuthorityConfigs(property.valueConstraint?.useValuesFrom)
      await Promise.all(authorities.map(authority => getTemplateSearchResults(authority.type).then((response) => {
        if (response.error !== undefined) return ''
        response.results?.forEach((hit) => {
          if (hit.resourceURI === authority.type) {
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
  }, [dispatch, property])

  const dropdown = items => <div className="dropdown">
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
  reduxPath: PropTypes.arrayOf(PropTypes.string).isRequired,
}

export default ResourceList
