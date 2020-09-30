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
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')

    // TODO: Add additional selection testing after https://github.com/LD4P/sinopia_editor/issues/2398
    // This test is limited by the selectors assigned in AsyncTypeahead and will be replaced
  })
})
