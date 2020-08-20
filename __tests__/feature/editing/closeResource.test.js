import { renderApp, createHistory, createStore } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import { createState } from '../../testUtilities/stateUtils'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('closing a resource', () => {
  const history = createHistory(['/editor/ld4p:RT:bf2:Title:AbbrTitle', '/editor/ld4p:RT:bf2:Note'])

  it('removes the resource from history and view', async () => {
    const state = createState({ hasTwoLiteralResources: true, buildTwoLiteralResources: true })
    const store = createStore(state)
    renderApp(store, history)

    // The first resource loaded into state is shown and is the active button tab
    await screen.findAllByRole('heading', { name: 'Abbreviated Title' })
    const abbreviatedTitleTab = await screen.findByRole('button', { name: 'Abbreviated Title' })
    expect(abbreviatedTitleTab).toHaveClass('active')

    // The second resource is the inactive button tab
    const noteTab = await screen.findByRole('button', { name: 'Note' })
    expect(noteTab).not.toHaveClass('active')

    // Closing the active tab will reveal the inactive resource as the one shown
    const closeBtn = screen.getAllByRole('button', { name: 'Close' })
    fireEvent.click(closeBtn[0])
    await screen.findAllByRole('heading', { name: 'Note' })

    // // without any navigation tabs
    expect(abbreviatedTitleTab).not.toBeInTheDocument()
    expect(noteTab).not.toBeInTheDocument()

    // Closing the only shown resource will direct to the resource templates page
    fireEvent.click(closeBtn[0])
    const resourceTemplatesTab = await screen.findByRole('link', { name: 'Resource Templates' })
    expect(resourceTemplatesTab).toHaveClass('active')
  })
})
