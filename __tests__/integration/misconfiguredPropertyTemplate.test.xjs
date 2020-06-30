import React from 'react'
import { fireEvent } from '@testing-library/react'
import {
  renderWithRedux, createReduxStore, setupModal, createBlankState,
} from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import Config from 'Config'
import * as sinopiaSearch from 'sinopiaSearch'

jest.mock('sinopiaSearch')

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('Loading a misconfigured property template', () => {
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    totalHits: 1,
    results: [{
      id: 'Sinopia:RT:Fixture:LookupWithValueTemplateRefs',
      remark: 'This is a sample Resource Template, content is meaningless',
      resourceLabel: 'test lookup type misconfigured with valueTemplateRefs',
      resourceURI: 'http://examples.org/bogusOntologies/Resource',
    }],
    error: undefined,
  })

  setupModal()
  const store = createReduxStore(createBlankState({ authenticated: true }))
  const app = (<MemoryRouter><App /></MemoryRouter>)
  const { getByText, findByText, getByPlaceholderText } = renderWithRedux(
    app, store,
  )

  it('notifies the user that misconfigured', async () => {
    // Selects the resource template
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.change(getByPlaceholderText(/Enter id, label/), { target: { value: 'test lookup type misconfigured' } })

    fireEvent.click(await findByText('test lookup type misconfigured with valueTemplateRefs'))

    expect(await findByText(/The following property templates have unknown types or lookups/)).toBeInTheDocument()
  })
})
