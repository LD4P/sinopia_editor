import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderApp } from 'testUtils'
import Config from 'Config'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('loading new resource', () => {
  it('opens the resource', async () => {
    renderApp()

    fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
    fireEvent.click(screen.getByText('Resource Templates', { selector: 'a' }))

    // The result
    await screen.findByText(/Uber template1/)
    screen.getByText('resourceTemplate:testing:uber1')
    screen.getByText('http://id.loc.gov/ontologies/bibframe/Uber1')
    screen.getAllByText('Justin Littman')
    screen.getByText('Jul 27, 2020')

    // Click the resource template
    fireEvent.click(screen.getByText('Uber template1', { selector: 'a' }))
    await waitFor(() => expect((screen.getAllByText('Uber template1', { selector: 'h3' }))).toHaveLength(1))

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
    screen.getByText('Uber template4', { selector: 'h5' })
    screen.getByPlaceholderText('Uber template4, property1')

    // Save button is disabled
    expect(screen.getAllByText('Save', { selector: 'button' })[0]).toBeDisabled()

    // Only current property's subproperties are expanded in the nav panel
    expect(screen.queryByText(/Uber template2/, { selector: 'button' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Uber template3/, { selector: 'button' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Uber template4/, { selector: 'button' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByTestId('Add Uber template1, property1'))

    // NOTE: using findByRole + a high timeout to allow enough time for the nav panel to re-render fully
    expect(await screen.findByText(/Uber template2/, { selector: 'button' })).toBeInTheDocument()
    expect(screen.queryByText(/Uber template3/, { selector: 'button' })).toBeInTheDocument()
    expect(screen.queryByText(/Uber template4/, { selector: 'button' })).not.toBeInTheDocument()


    fireEvent.click(screen.getByText(/Uber template1, property18/, { selector: 'button h5' }))

    expect(await screen.findByText(/Uber template4$/, { selector: 'button' })).toBeInTheDocument()
    expect(screen.queryByText(/Uber template2/, { selector: 'button' })).not.toBeInTheDocument()
    expect(screen.queryByText(/Uber template3/, { selector: 'button' })).not.toBeInTheDocument()
  }, 15000)
})
