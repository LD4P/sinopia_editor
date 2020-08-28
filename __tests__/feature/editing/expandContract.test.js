import Config from 'Config'
import { renderApp, createHistory } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('expanding and contracting properties', () => {
  it('shows and hides nested properties', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber1'])
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    screen.getByRole('heading', { name: /Uber template1, property1 / })
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property1' }))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // Add a nested property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template2, property1' }))
    // Input box displayed
    await screen.findByPlaceholderText('Uber template2, property1')

    // Hide
    fireEvent.click(screen.getByRole('button', { name: 'Hide Uber template2, property1' }))
    // Input box not displayed
    expect(screen.queryAllByPlaceholderText('Uber template2, property1').length).toBeFalsy()

    // Show
    fireEvent.click(screen.getByRole('button', { name: 'Show Uber template2, property1' }))
    // Input box displayed
    await screen.findByPlaceholderText('Uber template2, property1')
  })
})
