import { renderApp } from 'testUtils'
import { fireEvent, screen, wait } from '@testing-library/react'
import Config from 'Config'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)


describe('creating new resource template ', () => {
  it('opens the resource template for the resource', async () => {
    renderApp()

    fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
    fireEvent.click(screen.getByRole('link', { name: 'Resource Templates' }))

    // Click the new resource template button
    fireEvent.click(screen.getByRole('link', { name: '+ New resource template' }))
    await wait(() => expect((screen.getAllByRole('heading', { name: 'Resource Template (dummy)' }))).toHaveLength(1))
  })
})
