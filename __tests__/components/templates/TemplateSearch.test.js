// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import {
  renderWithRedux, renderWithReduxAndRouter, createReduxStore, createBlankState,
} from 'testUtils'
import { fireEvent } from '@testing-library/react'
import TemplateSearch from 'components/templates/TemplateSearch'
import SinopiaResourceTemplates from 'components/templates/SinopiaResourceTemplates'
import * as sinopiaSearch from 'sinopiaSearch'

jest.mock('sinopiaSearch')

describe('<TemplateSearch />', () => {
  const result1 = {
    id: 'ld4p:RT:bf2:Monograph:Instance',
    author: 'LD4P',
    date: '2019-08-19',
    resourceLabel: '_Monograph Instance (BIBFRAME)',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
  }

  const result2 = {
    id: 'ld4p:RT:bf2:Monograph:Work',
    author: 'LD4P',
    date: '2019-08-19',
    resourceLabel: '_Monograph Work (BIBFRAME)',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Work',
  }

  const result3 = {
    id: 'ld4p:RT:bf2:Serial:Instance',
    author: 'LD4P',
    date: '2019-08-19',
    resourceLabel: '_Serial Instance (BIBFRAME)',
    resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
  }

  beforeEach(() => {
    sinopiaSearch.getTemplateSearchResults.mockClear()
    sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
      totalHits: 3,
      results: [result1, result2, result3],
      error: undefined,
    })
  })

  it('renders', () => {
    const store = createReduxStore(createBlankState())
    const { getByPlaceholderText } = renderWithRedux(
      <TemplateSearch />, store,
    )

    expect(getByPlaceholderText(/Enter id, label/)).toBeInTheDocument()
  })

  it('performs a default search', async () => {
    const store = createReduxStore(createBlankState())
    renderWithRedux(<TemplateSearch />, store)

    expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenCalledWith('')
    await assertTemplate(store, 'ld4p:RT:bf2:Serial:Instance')
  })

  describe('searching', () => {
    beforeEach(() => {
      sinopiaSearch.getTemplateSearchResults.mockResolvedValueOnce({
        totalHits: 3,
        results: [result1, result2, result3],
        error: undefined,
      }).mockResolvedValueOnce({
        totalHits: 2,
        results: [result1, result3],
        error: undefined,
      }).mockResolvedValueOnce({
        totalHits: 1,
        results: [result3],
        error: undefined,
      })
    })

    it('searches and updates with results', async () => {
      const store = createReduxStore(createBlankState())
      const { getByPlaceholderText } = renderWithRedux(
        <TemplateSearch />, store,
      )

      const input = getByPlaceholderText(/Enter id, label/)
      await assertTemplate(store, result1.id)
      await assertTemplate(store, result2.id)
      await assertTemplate(store, result3.id)
      fireEvent.change(input, { target: { value: 'Instance' } })
      await assertTemplate(store, result1.id)
      await assertTemplate(store, result3.id)
      await assertNotTemplate(store, result2.id)
      fireEvent.change(input, { target: { value: 'Serial:Instance' } })
      await assertTemplate(store, result3.id)
      await assertNotTemplate(store, result1.id)
      await assertNotTemplate(store, result2.id)
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(1, '')
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(2, 'Instance')
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(3, 'Serial:Instance')
    })
  })

  describe('when there is a search error', () => {
    it('renders error', () => {
      const state = createBlankState()
      state.selectorReducer.templateSearch.error = 'ES is red'
      const store = createReduxStore(state)
      const { getByText } = renderWithRedux(
        <TemplateSearch />, store,
      )

      expect(getByText('ES is red')).toBeInTheDocument()
    })
  })
})

const assertTemplate = async (store, templateId) => {
  const { findByText, unmount } = renderWithReduxAndRouter(
    <SinopiaResourceTemplates />, store,
  )
  expect(await findByText(templateId)).toBeInTheDocument()
  unmount()
}

const assertNotTemplate = async (store, templateId) => {
  const { queryByText, unmount } = renderWithReduxAndRouter(
    <SinopiaResourceTemplates />, store,
  )
  expect(queryByText(templateId)).not.toBeInTheDocument()
  unmount()
}
