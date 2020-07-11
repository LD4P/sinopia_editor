// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CloseButton from './actions/CloseButton'
import { selectCurrentResourceKey, selectSubject } from 'selectors/resources'
import { setCurrentResource } from 'actions/resources'

const ResourcesNav = () => {
  const dispatch = useDispatch()

  const currentResourceKey = useSelector((state) => selectCurrentResourceKey(state))

  const resourceKeys = useSelector((state) => state.selectorReducer.editor.resources)

  const navLabels = useSelector((state) => {
    const labels = {}
    resourceKeys.forEach((resourceKey) => {
      const subject = selectSubject(state, resourceKey)
      const resourceLabel = subject.subjectTemplate.label
      labels[resourceKey] = resourceLabel.length > 40 ? `${resourceLabel.slice(0, 40)}...` : resourceLabel
    })
    return labels
  })

  const createResourceTemplateNavItem = (resourceKey, active) => {
    const linkClasses = ['nav-link', 'btn']
    const itemClasses = ['nav-item']
    let closeButton
    if (active) {
      linkClasses.push('active')
      itemClasses.push('active')
    } else {
      closeButton = <CloseButton label={'x'} css={'button'} resourceKey={resourceKey}/>
    }
    return (
      <li className={itemClasses.join(' ')} key={resourceKey}>
        <div className="btn-group">
          <button className={linkClasses.join(' ')}
                  href="#"
                  onClick={(event) => handleResourceNavClick(event, resourceKey)}>{navLabels[resourceKey]}</button>
          {closeButton}
        </div>
      </li>
    )
  }

  const generateNavItems = () => resourceKeys.map((resourceKey) => createResourceTemplateNavItem(resourceKey, resourceKey === currentResourceKey))
  const resourceTemplateNavItems = resourceKeys.length > 1 ? generateNavItems() : []

  const handleResourceNavClick = (event, resourceKey) => {
    event.preventDefault()
    dispatch(setCurrentResource(resourceKey))
  }

  if (resourceTemplateNavItems.length === 0) return null

  return (
    <div className="row">
      <div className="col">
        <ul className="nav nav-tabs resources-nav-tabs" style={{ marginBottom: '5px' }}>
          { resourceTemplateNavItems }
        </ul>
      </div>
    </div>
  ) }

export default ResourcesNav
