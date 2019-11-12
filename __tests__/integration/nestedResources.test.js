// Copyright 2019 Stanford University see LICENSE for license
import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  renderWithReduxAndRouter, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import App from 'components/App'
import * as sinopiaServer from 'sinopiaServer'
import * as sinopiaSearch from 'sinopiaSearch'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'

jest.mock('sinopiaServer')
jest.mock('sinopiaSearch')

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('Expanding a resource property in a property panel', () => {
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    totalHits: 1,
    results: [{
      id: 'resourceTemplate:bf2:Monograph:Instance',
      remark: 'This is altered greatly for testing purposes',
      resourceLabel: 'BIBFRAME Instance',
      resourceURI: 'http://id.loc.gov/ontologies/bibframe/Instance',
    }],
    error: undefined,
  })

  const store = createReduxStore(createBlankState({ authenticated: true }))
  setupModal()
  const {
    getByText, queryByText, findByText, container,
    getByPlaceholderText, queryByPlaceholderText, findByPlaceholderText,
  } = renderWithReduxAndRouter(
    (<App />), store,
  )

  it('loads a resource template and expands', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.change(getByPlaceholderText(/Enter id, label/), { target: { value: 'resourceTemplate:bf2:Monograph:Instance' } })

    fireEvent.click(await findByText('BIBFRAME Instance'))

    expect(await findByText(/Instance of/)).toBeInTheDocument()

    // Clicks on one of the property type rows to expand a nested resource
    fireEvent.click(getByText('+ Add', { selector: 'button.btn-add[data-id="hasInstance"]' }))
    expect(await findByText('BIBFRAME Instance', { selector: 'h5' })).toBeInTheDocument()

    // Now remove it
    fireEvent.click(await container.querySelector('button.btn-remove[data-id="hasInstance"]'))
    expect(queryByText('BIBFRAME Instance', { selector: 'h5' })).not.toBeInTheDocument()

    // nested property with default is already expanded
    expect(getByPlaceholderText('Holdings')).toBeInTheDocument()

    // nested property clicks on a nested property to reveal an input component
    fireEvent.click(getByText('+ Add', { selector: 'button.btn-add[data-id="frequency"]' }))
    expect(await findByPlaceholderText('Frequency (RDA 2.14)')).toBeInTheDocument()

    // Now remove it
    fireEvent.click(await findByText('Remove', { selector: 'button.btn-remove[data-id="frequency"]' }))
    expect(queryByPlaceholderText('Frequency (RDA 2.14)')).not.toBeInTheDocument()

    // enters a value into a nested property component
    expect(queryByText('Some text')).not.toBeInTheDocument()

    const input = getByPlaceholderText('Holdings')
    fireEvent.change(input, { target: { value: 'Some text' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(getByText(/Some text/, { selector: 'div.rbt-token' })).toBeInTheDocument()

    // enters a non-roman value into a nested property component
    expect(queryByText('甲骨文')).not.toBeInTheDocument()

    fireEvent.change(input, { target: { value: '甲骨文' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    expect(getByText(/甲骨文/, { selector: 'div.rbt-token' })).toBeInTheDocument()
  })
})
