// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import { createStore } from 'redux'
import ResourcesNav from 'components/editor/ResourcesNav'
import appReducer from 'reducers/index'
import { renderWithRedux, createBlankState } from 'testUtils'
import { fireEvent } from '@testing-library/react'


describe('<ResourcesNav />', () => {
  const shelfmarkResource = {
    'resourceTemplate:bf2:Identifiers:Shelfmark': {
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#value': {},
    },
  }

  const abbrTitleResource = {
    'ld4p:RT:bf2:Title:AbbrTitle': {
      'http://id.loc.gov/ontologies/bibframe/mainTitle': {},
    },
  }

  const shelfmarkTemplate = {
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/ShelfMark',
    id: 'resourceTemplate:bf2:Identifiers:Shelfmark',
    resourceLabel: 'Accession or copy number',
  }

  const abbrTitleTemplate = {
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
    id: 'ld4p:RT:bf2:Title:AbbrTitle',
    resourceLabel: 'Abbreviated Title But Not a Very Abbreviated Label',
  }

  describe('When one resource', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'fAPJnBeb'
    state.selectorReducer.entities.resources.fAPJnBeb = shelfmarkResource
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Identifiers:Shelfmark'] = shelfmarkTemplate

    it('does not render any navs', () => {
      const store = createStore(appReducer, state)
      const { queryByText } = renderWithRedux(
        <ResourcesNav />, store,
      )

      expect(queryByText('Accession or copy number')).not.toBeInTheDocument()
    })
  })

  describe('When multiple resources', () => {
    const state = createBlankState()
    state.selectorReducer.editor.currentResource = 'fAPJnBeb'
    state.selectorReducer.entities.resources.fAPJnBeb = shelfmarkResource
    state.selectorReducer.entities.resources.QncioWI = abbrTitleResource
    state.selectorReducer.entities.resourceTemplates['resourceTemplate:bf2:Identifiers:Shelfmark'] = shelfmarkTemplate
    state.selectorReducer.entities.resourceTemplates['ld4p:RT:bf2:Title:AbbrTitle'] = abbrTitleTemplate

    it('render navs', () => {
      const store = createStore(appReducer, state)
      const { getByText } = renderWithRedux(
        <ResourcesNav />, store,
      )

      expect(getByText('Accession or copy number', { selector: '.active' })).toBeInTheDocument()
      expect(getByText('Abbreviated Title But Not a Very Abbrevi...', { selector: '.nav-link' })).toBeInTheDocument()

      // Clicking changes active
      fireEvent.click(getByText('Abbreviated Title But Not a Very Abbrevi...'))
      expect(getByText('Abbreviated Title But Not a Very Abbrevi...', { selector: '.active' })).toBeInTheDocument()
    })
  })
})
