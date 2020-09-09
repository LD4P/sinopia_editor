import { renderApp, createHistory, createStore } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import { createState } from 'stateUtils'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
const history = createHistory(['/editor/ld4p:RT:bf2:Title:AbbrTitle', '/editor/ld4p:RT:bf2:Note'])

describe('switching between multiple resources', () => {
  const state = createState({ hasTwoLiteralResources: true })
  const store = createStore(state)

  it('has a resource loaded into state and is shown as the active button tab', async () => {
    renderApp(store, history)

    await screen.findAllByRole('heading', { name: 'Abbreviated Title' })
    // NOTE: There are two buttons with this name, so retrieve element using a selector
    const abbreviatedTitleTab = screen.getByText('Abbreviated Title', { selector: 'button.nav-link' })
    expect(abbreviatedTitleTab).toHaveClass('active')
  })

  it('has a second resource shown as the inactive button tab', async () => {
    renderApp(store, history)

    const noteTab = await screen.findByRole('button', { name: 'Note' })
    expect(noteTab).not.toHaveClass('active')
  })

  it('switches between the active and inactive resources', async () => {
    renderApp(store, history)

    // Click the inactive button tab
    const noteTab = await screen.findByRole('button', { name: 'Note' })
    fireEvent.click(noteTab)
    expect(noteTab).toHaveClass('active')

    // Note is now the active resource and Abbreviated Title is now the inactive resource
    await screen.findAllByRole('heading', { name: 'Note' })
    const abbreviatedTitleTab = await screen.findByRole('button', { name: 'Abbreviated Title' })
    expect(abbreviatedTitleTab).not.toHaveClass('active')
  })
})

describe('closing the resources', () => {
  const state = createState({ hasTwoLiteralResources: true })
  const store = createStore(state)

  it('removes the navigation tabs and the resources from view', async () => {
    renderApp(store, history)

    // NOTE: There are two buttons with this name, so retrieve element using a selector
    const abbreviatedTitleTab = screen.getByText('Abbreviated Title', { selector: 'button.nav-link' })
    const noteTab = await screen.findByRole('button', { name: 'Note' })

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
