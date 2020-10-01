import { renderApp, createHistory } from 'testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import { featureSetup } from 'featureUtils'

featureSetup()

describe('selecting a value from the lookup modal', () => {
  const history = createHistory(['/editor/test:resource:DiscogsLookup'])

  it('allows entering and selecting a value from a lookup modal', async () => {
    renderApp(null, history)

    await screen.findByText('Testing discogs lookup', { selector: 'h3' })
    const addButton = screen.getByTestId('lookup') // get the add button

    fireEvent.click(addButton)

    await waitFor(() => expect(screen.getByLabelText('Instance of (lookup)')))

    const input = screen.getByLabelText('Instance of (lookup)')

    fireEvent.keyUp(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')

    // Checks if the Add Literal button is available
    screen.getByLabelText(/add as new literal/i)

    // Adds URI to search on
    fireEvent.keyUp(input, { target: { value: 'http://example.com/' } })

    // Checks if the  Add URI button is available
    screen.getByLabelText(/add as new uri/i)
  })
})
