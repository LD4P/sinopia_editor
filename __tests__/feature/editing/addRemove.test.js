import Config from 'Config'
import { renderApp, createHistory } from 'testUtils'
import { fireEvent, wait, screen } from '@testing-library/react'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })


describe('adding and removing properties', () => {
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('adds and removes panel properties', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    screen.getByRole('heading', { name: /Uber template1, property2/ })
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property2' }))

    // Input box displayed
    await screen.findByPlaceholderText('Uber template1, property2')
    // Add button removed.
    expect(screen.queryAllByRole('button', { name: 'Add Uber template1, property2' })).toHaveLength(0)

    // Now remove it.
    fireEvent.click(screen.getByRole('button', { name: 'Remove Uber template1, property2' }))

    // Input box removed.
    expect((await screen.queryAllByPlaceholderText('Uber template1, property2'))).toHaveLength(0)
    // Add button displayed.
    screen.getByRole('button', { name: 'Add Uber template1, property2' })
    // Remove button removed.
    expect(screen.queryAllByRole('button', { name: 'Remove Uber template1, property2' })).toHaveLength(0)
  })

  it('adds and removes repeatable nested resources', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    screen.getByRole('heading', { name: /Uber template1, property1 / })
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property1' }))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // No remove
    expect(screen.queryAllByRole('button', { name: 'Remove Uber template2' }).length).toBeFalsy
    // Add another Uber template2
    fireEvent.click(screen.getByRole('button', { name: 'Add another Uber template2' }))

    // Two resource properties
    await wait(() => expect(screen.queryAllByText('Uber template2').length).toEqual(2))
    // Two remove buttons
    const removeBtns = screen.queryAllByRole('button', { name: 'Remove Uber template2' })
    expect(removeBtns.length).toEqual(2)
    // Add another still visible
    screen.getByRole('button', { name: 'Add another Uber template2' })

    // Remove the first
    fireEvent.click(removeBtns[0])
    // One resource property
    await screen.findByText('Uber template2')
    // No remove
    expect(screen.queryAllByRole('button', { name: 'Remove Uber template2' }).length).toBeFalsy
    // Add another still visible
    screen.getByRole('button', { name: 'Add another Uber template2' })
  })

  it('adds and removes non-repeatable nested resources', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    screen.getByRole('heading', { name: /Uber template1, property3/ })
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property3' }))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // No remove
    expect(screen.queryAllByRole('button', { name: 'Remove Uber template2' }).length).toBeFalsy
    // No add another
    expect(screen.queryAllByRole('button', { name: 'Add another Uber template2' }).length).toBeFalsy
  })

  it('adds and removes nested inputs', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    screen.getByRole('heading', { name: /Uber template1, property1 / })
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property1' }))

    await screen.findByText('Uber template2')
    await screen.findByText('Uber template3')

    // Add a nested property (literal)
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template2, property1' }))
    // Input box displayed
    await screen.findByPlaceholderText('Uber template2, property1')

    // Now remove it.
    fireEvent.click(screen.getByRole('button', { name: 'Remove Uber template2, property1' }))

    // Input box removed.
    expect((await screen.queryAllByPlaceholderText('Uber template2, property1'))).toHaveLength(0)
    // Delete button removed
    expect(screen.queryAllByRole('button', { name: 'Remove Uber template2, property1' })).toHaveLength(0)
  })
})
