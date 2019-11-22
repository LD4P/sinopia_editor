// Copyright 2019 Stanford University see LICENSE for license

import React from 'react'
import {
  renderWithReduxAndRouter, createReduxStore, createBlankState,
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
    const { getByPlaceholderText } = renderWithReduxAndRouter(
      <TemplateSearch />, store,
    )

    expect(getByPlaceholderText(/Enter id, label/)).toBeInTheDocument()
  })

  it('performs a default search', async () => {
    const store = createReduxStore(createBlankState())
    const { unmount } = renderWithReduxAndRouter(<TemplateSearch />, store)

    expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenCalledWith('', { startOfRange: 0 })
    unmount()
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
      const { getByPlaceholderText, unmount } = renderWithReduxAndRouter(
        <TemplateSearch />, store,
      )

      const input = getByPlaceholderText(/Enter id, label/)
      fireEvent.change(input, { target: { value: 'Instance' } })
      fireEvent.change(input, { target: { value: 'Serial:Instance' } })
      unmount()
      await assertTemplate(store, result3.id)
      await assertNotTemplate(store, result1.id)
      await assertNotTemplate(store, result2.id)
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(1, '', { startOfRange: 0 })
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(2, 'Instance', { startOfRange: 0 })
      expect(sinopiaSearch.getTemplateSearchResults).toHaveBeenNthCalledWith(3, 'Serial:Instance', { startOfRange: 0 })
    })
  })

  describe('when there is a search error', () => {
    beforeEach(() => {
      sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
        totalHits: 0,
        results: [],
        error: 'ES is red',
      })
    })

    it('renders error', async () => {
      const store = createReduxStore(createBlankState())
      const { findByText } = renderWithReduxAndRouter(
        <TemplateSearch />, store,
      )

      expect(await findByText('ES is red')).toBeInTheDocument()
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
