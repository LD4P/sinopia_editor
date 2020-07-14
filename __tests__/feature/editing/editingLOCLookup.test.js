import { renderApp, createHistory, createStore, } from 'testUtils'
import { createState } from 'stateUtils'
import { fireEvent, wait, screen } from '@testing-library/react'
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate } from 'fixtureLoaderHelper'

jest.mock('sinopiaServer')
// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

const mrectype = [{
  '@id': 'http://id.loc.gov/vocabulary/mrectype/analog',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'analog',
  }],
}, {
  '@id': 'http://id.loc.gov/vocabulary/mrectype/digital',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'digital',
  }],
}]

const mrecmedium = [{
  '@id': 'http://id.loc.gov/vocabulary/mrecmedium/opt',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'optical',
  }],
}, {
  '@id': 'http://id.loc.gov/vocabulary/mrecmedium/magopt',
  '@type': ['http://www.loc.gov/mads/rdf/v1#Authority'],
  'http://www.loc.gov/mads/rdf/v1#authoritativeLabel': [{
    '@value': 'magneto-optical',
  }],
}]

const lookups = {
  'https://id.loc.gov/vocabulary/mrectype.json': mrectype,
  'https://id.loc.gov/vocabulary/mrecmedium.json': mrecmedium,
}

describe('editing a LOC lookup property', () => {
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  global.fetch = jest.fn().mockImplementation((url) => Promise.resolve({ json: () => lookups[url] }))

  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('allows entering and removing a non-repeatable resource', async () => {
    const state = createState()

    renderApp(createStore(state), history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property7' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property7')
    fireEvent.click(input)
    fireEvent.focus(input)

    // Dropdown header
    await screen.findByText('type of recording', { selector: '.dropdown-header' })

    // // Dropdown values
    await screen.findByText('analog', { selector: '.dropdown-item' })
    await screen.findByText('digital', { selector: '.dropdown-item' })

    // Start typing digital
    fireEvent.change(input, { target: { value: 'digi' } })

    await wait(() => expect(screen.queryByText('analog', { selector: '.dropdown-item' })).not.toBeInTheDocument())
    await screen.findByText('digital', { selector: '.dropdown-item' })

    fireEvent.click(screen.getByText('digital', { selector: '.dropdown-item' }))


    // Input is disabled for multiple values
    expect(input).toBeDisabled()

    // The label is displayed.
    await screen.findByText('digital', {selector: 'a'})
    // There is a remove button.
    const removeBtn = screen.getByRole('button', { name: 'Remove' })
    expect(removeBtn).toHaveTextContent('×')

    // Clicking remove
    fireEvent.click(removeBtn)
    expect(screen.queryByText('digital', {selector: 'a'})).not.toBeInTheDocument()
  })

  it('allows entering a repeatable resource', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property8' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property8')
    fireEvent.click(input)

    // Dropdown header
    screen.getByText('type of recording', { selector: '.dropdown-header' })

    // Dropdown values
    await screen.findByText('analog', { selector: '.dropdown-item' })
    await screen.findByText('digital', { selector: '.dropdown-item' })

    // Start typing digital
    fireEvent.change(input, { target: { value: 'digi' } })

    await wait(() => expect(screen.queryByText('analog', { selector: '.dropdown-item' })).not.toBeInTheDocument())
    await screen.findByText('digital', { selector: '.dropdown-item' })

    fireEvent.click(screen.getByText('digital', { selector: '.dropdown-item' }))

    // Input is not disabled for multiple values
    expect(input).not.toBeDisabled()

    // The label is displayed.
    await screen.findByText('digital', {selector: 'a'})

    fireEvent.change(input, { target: { value: 'ana' } })
    await screen.findByText('analog', { selector: '.dropdown-item' })

    fireEvent.click(screen.getByText('analog', { selector: '.dropdown-item' }))

    // The label is displayed.
    await screen.findByText('analog', {selector: 'a'})
  })

  it('allows entering a new URI', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property7' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property7')
    fireEvent.click(input)

    fireEvent.change(input, { target: { value: 'http://foo' } })

    await screen.findByText('http://foo', { selector: '.dropdown-item' })

    // Dropdown header
    screen.getByText('New URI', { selector: '.dropdown-header' })

    fireEvent.click(screen.getByText('http://foo', { selector: '.dropdown-item' }))

    // The label is displayed.
    await screen.findByText('http://foo', {selector: 'a'})
  })

  it('allows entering a new literal', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property7' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property7')
    fireEvent.click(input)

    fireEvent.change(input, { target: { value: 'foo' } })

    await screen.findByText('foo', { selector: '.dropdown-item' })

    // Dropdown header
    screen.getByText('New Literal', { selector: '.dropdown-header' })

    fireEvent.click(screen.getByText('foo', { selector: '.dropdown-item' }))

    // The label is displayed.
    await screen.findByText('foo', {selector: 'div'})
  })

  it('allows toggling authorities', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property9' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property9')
    fireEvent.click(input)

    // Dropdown headers
    await screen.findByText('recording medium', { selector: '.dropdown-header' })
    await screen.findByText('type of recording', { selector: '.dropdown-header' })

    // Dropdown values
    await screen.findByText('analog', { selector: '.dropdown-item' })
    await screen.findByText('digital', { selector: '.dropdown-item' })
    await screen.findByText('magneto-optical', { selector: '.dropdown-item' })
    await screen.findByText('optical', { selector: '.dropdown-item' })

    // Click recording medium checkbox
    const checkbox = screen.getByLabelText('recording medium')
    fireEvent.click(checkbox)
    await wait(() => expect(checkbox.checked).toBe(false))

    expect(screen.queryByText('recording medium', { selector: '.dropdown-header' })).not.toBeInTheDocument()
    screen.getByText('type of recording', { selector: '.dropdown-header' })

    await screen.findByText('analog', { selector: '.dropdown-item' })
    await screen.findByText('digital', { selector: '.dropdown-item' })
    expect(screen.queryByText('magneto-optical', { selector: '.dropdown-item' })).not.toBeInTheDocument()
    expect(screen.queryByText('optical', { selector: '.dropdown-item' })).not.toBeInTheDocument()

  })
})
