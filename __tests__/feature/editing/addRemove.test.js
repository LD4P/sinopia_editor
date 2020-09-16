import Config from 'Config'
import { renderApp, createHistory } from 'testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('adding and removing properties', () => {
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('adds and removes panel properties', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a panel property
    expect(screen.getAllByText(/Uber template1, property2$/)).toHaveLength(2) // do not want to match property20!
    fireEvent.click(screen.getByTestId('Add Uber template1, property2'))

    // Input box displayed
    await screen.findByPlaceholderText('Uber template1, property2')
    // Add button removed.
    expect(screen.queryAllByTestId('Add Uber template1, property2')).toHaveLength(0)

    // Now remove it.
    fireEvent.click(screen.getByTestId('Remove Uber template1, property2'))

    // Input box removed.
    expect((await screen.queryAllByPlaceholderText('Uber template1, property2'))).toHaveLength(0)
    // Add button displayed.
    screen.getByTestId('Add Uber template1, property2')
    // Remove button removed.
    expect(screen.queryAllByTestId('Remove Uber template1, property2')).toHaveLength(0)
  }, 15000)

  it('adds and removes repeatable nested resources', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a panel property
    screen.getByText('Uber template1, property1', { selector: 'span' })
    fireEvent.click(screen.getByTestId('Add Uber template1, property1'))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // No remove
    expect(screen.queryAllByTestId('Remove Uber template2')).toHaveLength(0)
    // Add another Uber template2
    fireEvent.click(screen.getByTestId('Add another Uber template2'))

    // Two resource properties
    await waitFor(() => expect(screen.queryAllByText('Uber template2')).toHaveLength(2))
    // Two remove buttons
    const removeBtns = screen.queryAllByTestId('Remove Uber template2')
    expect(removeBtns).toHaveLength(2)
    // Add another still visible
    screen.getByTestId('Add another Uber template2')

    // Remove the first
    fireEvent.click(removeBtns[0])
    // One resource property
    await screen.findByText('Uber template2')
    // No remove
    expect(screen.queryAllByTestId('Remove Uber template2')).toHaveLength(0)
    // Add another still visible
    screen.getByTestId('Add another Uber template2')
  }, 25000)

  it('adds and removes non-repeatable nested resources', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a panel property
    expect(screen.getAllByText('Uber template1, property3')).toHaveLength(2)
    fireEvent.click(screen.getByTestId('Add Uber template1, property3'))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // No remove
    expect(screen.queryAllByTestId('Remove Uber template2')).toHaveLength(0)
    // No add another
    expect(screen.queryAllByTestId('Add another Uber template2')).toHaveLength(0)
  }, 15000)

  it('adds and removes nested inputs', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a panel property
    screen.getByText('Uber template1, property1', { selector: 'span' })
    fireEvent.click(screen.getByTestId('Add Uber template1, property1'))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // Add a nested property (literal)
    fireEvent.click(screen.getByTestId('Add Uber template2, property1'))
    // Input box displayed
    await screen.findByPlaceholderText('Uber template2, property1')

    // Now remove it.
    fireEvent.click(screen.getByTestId('Remove Uber template2, property1'))

    // Input box removed.
    expect((await screen.queryAllByPlaceholderText('Uber template2, property1'))).toHaveLength(0)
    // Delete button removed
    expect(screen.queryAllByTestId('Remove Uber template2, property1')).toHaveLength(0)
  }, 15000)
})
