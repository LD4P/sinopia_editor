import { renderApp } from 'testUtils'
import { fireEvent, screen, wait } from '@testing-library/react'
import Config from 'Config'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)


describe('loading new resource', () => {
  it('opens the resource', async () => {
    renderApp()

    fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
    fireEvent.click(screen.getByRole('link', { name: 'Resource Templates' }))

    // The result
    await screen.findByText(/Uber template1/)
    screen.getByText('resourceTemplate:testing:uber1')
    screen.getByText('http://id.loc.gov/ontologies/bibframe/Uber1')
    screen.getAllByText('Justin Littman')
    screen.getByText('Jul 27, 2020')

    // Click the resource template
    screen.debug(screen.getByRole('link', { name: 'Uber template1' }))
    fireEvent.click(screen.getByRole('link', { name: 'Uber template1' }))
    await wait(() => expect((screen.getAllByRole('heading', { name: 'Uber template1' }))).toHaveLength(1))


    // Not duplicating testing of rendering of resource template from loadResource test.

    // Defaults are displayed
    screen.getByText('Default literal1')
    screen.getByText('Default literal2')
    screen.getByText('Default URI1')
    screen.getByText('http://sinopia.io/defaultURI2')

    // Required properties are expanded.
    screen.getByPlaceholderText('Uber template1, property4')
    screen.getByPlaceholderText('Uber template1, property5')
    screen.getByPlaceholderText('Uber template1, property10')
    screen.getByPlaceholderText('Uber template1, property15')
    screen.getByPlaceholderText('Uber template1, property16')
    screen.getByRole('heading', { name: 'Uber template4' })
    screen.getByPlaceholderText('Uber template4, property1')

    // Save button is disabled
    expect(screen.getAllByRole('button', { name: 'Save' })[0]).toBeDisabled()
  })
})
