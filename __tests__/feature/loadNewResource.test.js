import { fireEvent, screen, wait } from '@testing-library/react'
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

    fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
    fireEvent.click(screen.getByRole('link', { name: 'Resource Templates' }))

    // The result
    await screen.findByText(/Uber template1/)
    screen.getByText('resourceTemplate:testing:uber1')
    screen.getByText('http://id.loc.gov/ontologies/bibframe/Uber1')
    screen.getAllByText('Justin Littman')
    screen.getByText('Jul 27, 2020')

    // Click the resource template
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

    // Only current property's subproperties are expanded in the nav panel
    expect(screen.queryByRole('button', { name: '• Uber template2' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '• Uber template3' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '• Uber template4' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property1' }))

    // NOTE: using findByRole + a high timeout to allow enough time for the nav panel to re-render fully
    expect(await screen.findByRole('button', { name: '• Uber template2' })).toBeInTheDocument()
    expect(await screen.findByRole('button', { name: '• Uber template3' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '• Uber template4' })).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Uber template1, property18' }))

    expect(screen.queryByRole('button', { name: '• Uber template2' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '• Uber template3' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: '• Uber template4' })).toBeInTheDocument()
  }, 15000)
})
