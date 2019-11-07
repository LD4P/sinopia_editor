// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getResourceTemplate, rootResourceTemplateId,
  currentResourceKey as currentResourceKeySelector,
} from 'selectors/resourceSelectors'
import { setCurrentResource } from 'actions/index'

const ResourcesNav = () => {
  const dispatch = useDispatch()

  const currentResourceKey = useSelector(state => currentResourceKeySelector(state))

  const resourceKeys = useSelector(state => Object.keys(state.selectorReducer.entities.resources))

  const navLabels = useSelector((state) => {
    const labels = {}
    resourceKeys.forEach((resourceKey) => {
      const resourceTemplateId = rootResourceTemplateId(state, resourceKey)
      const resourceLabel = getResourceTemplate(state, resourceTemplateId).resourceLabel
      labels[resourceKey] = resourceLabel.length > 40 ? `${resourceLabel.slice(0, 40)}...` : resourceLabel
    })
    return labels
  })

  const createResourceTemplateNavItem = (resourceKey, active) => {
    const classes = ['nav-link', 'btn', 'btn-link']
    if (active) classes.push('active')
    return (
      <li className="nav-item" key={resourceKey}>
        <button className={classes.join(' ')}
                href="#"
                onClick={event => handleResourceNavClick(event, resourceKey)}>{navLabels[resourceKey]}</button>
      </li>
    )
  }

  const generateNavItems = () => resourceKeys.map(resourceKey => createResourceTemplateNavItem(resourceKey, resourceKey === currentResourceKey))
  const resourceTemplateNavItems = resourceKeys.length > 1 ? generateNavItems() : []

  const handleResourceNavClick = (event, resourceKey) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
  }

  return (
    <div className="row">
      <ul className="nav nav-tabs">
        { resourceTemplateNavItems }
      </ul>
    </div>
  ) }

export default ResourcesNav
