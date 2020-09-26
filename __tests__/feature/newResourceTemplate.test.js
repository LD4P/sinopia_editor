import { renderApp } from 'testUtils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import Config from 'Config'

// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()
// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('creating new resource template ', () => {
  it('opens the resource template for the resource', async () => {
    renderApp()

    fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
    fireEvent.click(screen.getByText('Resource Templates', { selector: 'a' }))

    // Click the new resource template button
    fireEvent.click(screen.getByText('+ New template', { selector: 'a' }))
    await waitFor(() => expect((screen.getByText('Resource Template (dummy)', { selector: 'h3' }))))
  }, 15000)
})
