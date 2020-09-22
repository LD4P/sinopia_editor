import { renderApp, createHistory, createStore } from 'testUtils'
import { act, fireEvent, screen } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import Config from 'Config'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)
jest.mock('sinopiaSearch')

describe('Copying a template resource', () => {
  const history = createHistory(['/templates'])
  const store = createStore()
  const promise = Promise.resolve()

  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    results: [
      {
        id: 'sinopia:template:resource',
        author: null,
        date: null,
        remark: null,
        resourceLabel: 'Resource Template (dummy)',
        resourceURI: 'http://sinopia.io/vocabulary/ResourceTemplate',
        uri: 'http://localhost:3000/resource/sinopia:template:resource',
      },
    ],
    totalHits: 1,
    options: {
      startOfRange: 0,
      resultsPerPage: 10,
    },
  })

  it('clicks on the copy button', async () => {
    renderApp(store, history)

    // Search for the template resource
    const input = screen.getByPlaceholderText('Enter id, label, URI, remark, or author')
    await fireEvent.change(input, { target: { value: 'dummy' } })
    await screen.findByText('sinopia:template:resource')

    // Open the template
    fireEvent.click(await screen.findByTestId('Copy Resource Template (dummy)'))
    await act(() => promise)

    // Headers and labels appear
    await screen.findByText('Resource Template (dummy)', { selector: 'h3' })
    const labels = await screen.findAllByText('Resource Template (dummy)')
    expect(labels.length).toBe(2)

    // But there is no resource URI for the unsaved copy
    expect(screen.queryByText(/URI for this resource: <http:\/\/localhost:3000\/resource\/sinopia:template:resource>/))
      .not.toBeInTheDocument()

    const saveBtn = await screen.findAllByRole('button', { name: 'Save' })
    expect(saveBtn[0]).not.toBeDisabled()
  })
})
