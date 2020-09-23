import { renderApp, createHistory, createStore } from 'testUtils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import { createState } from 'stateUtils'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('Editing a template resource', () => {
  const history = createHistory(['/editor/sinopia:template:resource'])
  const state = createState({ hasTemplateWithLiteral: true })
  const store = createStore(state)

  it('has a resource loaded into state', async () => {
    renderApp(store, history)

    // Template header appears
    await screen.findByText('Resource Template (dummy)', { selector: 'h3' })

    // Left-nav button and Property headers appear
    const labels = await screen.findAllByText('Resource Template (dummy)')
    expect(labels.length).toBe(2)

    screen.findByText(/URI for this resource: <http:\/\/localhost:3000\/resource\/sinopia:template:resource>/)
  })

  it('edits the template values', async () => {
    renderApp(store, history)

    // Change the note text
    fireEvent.click(await screen.findByTestId('Edit Resource Template (dummy)'))

    const noteField = await screen.findByRole('textbox', { placeholder: 'Resource Template (dummy)' })
    fireEvent.click(noteField)

    fireEvent.change(noteField, { target: { value: 'Tai Note Template' } })
    fireEvent.keyPress(noteField, { key: 'Enter', code: 13, charCode: 13 })
    await expect(screen.getByText('Tai Note Template')).toHaveClass('rbt-token')

    // Change the note language
    fireEvent.click(await screen.findByTestId('Change language for Tai Note Template'))

    const langField = await screen.findByTestId('langComponent-Tai Note Template')
    fireEvent.click(langField)

    await waitFor(() => 5000)

    fireEvent.click(await screen.findByText('Tai languages'))
    fireEvent.click(screen.getByTestId('submit-Tai Note Template'))

    await waitFor(() => 1000)

    screen.getByText(/Language: Tai languages/)

    const saveBtn = await screen.findAllByRole('button', { name: 'Save' })
    expect(saveBtn[0]).not.toBeDisabled()
  })
})
