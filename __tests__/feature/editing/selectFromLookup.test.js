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

    await waitFor(() => expect(screen.getByText('Lookup')).toHaveClass('modal-title'))

    const input = screen.getByPlaceholderText('Instance of (lookup)')
    fireEvent.change(input, { target: { value: 'test' } })

    expect(input).toHaveValue('test')

    // TODO: Add additional selection testing after https://github.com/LD4P/sinopia_editor/issues/2398
    // This test is limited by the selectors assigned in AsyncTypeahead and will be replaced
  })
})
