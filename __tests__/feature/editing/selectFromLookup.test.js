import { renderApp, createHistory } from 'testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

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
