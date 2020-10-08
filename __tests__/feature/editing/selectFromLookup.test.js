import { renderApp, createHistory } from 'testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import { featureSetup } from 'featureUtils'
import * as lookup from 'utilities/Lookup'

featureSetup()

lookup.getLookupResult = jest.fn().mockResolvedValue({ results: [], totalHits: 0 })

describe('selecting a value from lookup', () => {
  const history = createHistory(['/editor/test:resource:DiscogsLookup'])

  it('allows entering and selecting a value from a lookup', async () => {
    renderApp(null, history)

    await screen.findByText('Testing discogs lookup', { selector: 'h3' })

    const input = screen.getByPlaceholderText('Enter lookup query')

    fireEvent.change(input, { target: { value: 'test' } })
    expect(input).toHaveValue('test')
    fireEvent.click(screen.getByTitle('Submit lookup'))

    // Checks if the Add Literal button is available
    await screen.findByText(/Add new literal/)

    fireEvent.click(screen.getByTestId('Close lookup for Instance of (lookup)'))

    await waitFor(() => expect(input).toHaveValue(''))

    // Adds URI to search on
    fireEvent.change(input, { target: { value: 'http://example.com/' } })
    expect(input).toHaveValue('http://example.com/')
    fireEvent.click(screen.getByTitle('Submit lookup'))

    // Checks if the  Add URI button is available
    await screen.findByText(/Add new URI/)
  })
})
