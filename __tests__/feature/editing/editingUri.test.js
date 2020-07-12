import { renderApp, createHistory } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate } from 'fixtureLoaderHelper'

jest.mock('sinopiaServer')
// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('editing a URI property', () => {
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('allows entering, editing, and removing a non-repeatable URI', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property5' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property5')
    fireEvent.change(input, { target: { value: 'http://id.loc.gov/authorities/names/n79032058' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // // There is uri text.
    expect(screen.getByText('http://id.loc.gov/authorities/names/n79032058')).toHaveClass('rbt-token')
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove http://id.loc.gov/authorities/names/n79032058' })).toHaveTextContent('×')
    // There is edit button.
    const editBtn = screen.getByRole('button', { name: 'Edit http://id.loc.gov/authorities/names/n79032058' })
    expect(editBtn).toHaveTextContent('Edit')
    // Input is disabled and empty
    expect(input).toBeDisabled
    expect(input).toHaveValue('')

    // Clicking edit
    fireEvent.click(editBtn)
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('http://id.loc.gov/authorities/names/n79032058')
    expect(screen.queryAllByText('http://id.loc.gov/authorities/names/n79032058').length).toBeFalsy()

    // Clicking remove
    fireEvent.change(input, { target: { value: 'http://id.loc.gov/authorities/names/n79056054' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    expect(screen.getByText('http://id.loc.gov/authorities/names/n79056054')).toHaveClass('rbt-token')
    const removeBtn = screen.getByRole('button', { name: 'Remove http://id.loc.gov/authorities/names/n79056054' })
    fireEvent.click(removeBtn)

    expect(screen.queryAllByText('http://id.loc.gov/authorities/names/n79056054').length).toBeFalsy()
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('')
  })

  it('allows entering a repeatable URI', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property6' }))

    // Add two values
    const input = screen.getByPlaceholderText('Uber template1, property6')
    fireEvent.change(input, { target: { value: 'http://id.loc.gov/authorities/names/n79032058' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(input, { target: { value: 'http://id.loc.gov/authorities/names/n79056054' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is first uri.
    expect(screen.getByText('http://id.loc.gov/authorities/names/n79032058')).toHaveClass('rbt-token')
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove http://id.loc.gov/authorities/names/n79032058' })).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByRole('button', { name: 'Edit http://id.loc.gov/authorities/names/n79032058' })).toHaveTextContent('Edit')

    // And second uri.
    expect(screen.getByText('http://id.loc.gov/authorities/names/n79056054')).toHaveClass('rbt-token')
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove http://id.loc.gov/authorities/names/n79056054' })).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByRole('button', { name: 'Edit http://id.loc.gov/authorities/names/n79056054' })).toHaveTextContent('Edit')

    // Input is not disabled and empty
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('')
  })

  it('validates that a URI', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property5' }))

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property5')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    screen.getByText('Not a valid URI.')
    expect(input).toHaveValue('foo')
  })
})
