import { renderApp, createHistory } from 'testUtils'
import { fireEvent, wait, screen } from '@testing-library/react'
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate } from 'fixtureLoaderHelper'

jest.mock('sinopiaServer')
// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('editing a literal property', () => {
  sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('allows entering, editing, and removing a non-repeatable literal', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text. Perhaps check css.
    await wait(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove foo' })).toHaveTextContent('×')
    // There is edit button.
    const editBtn = screen.getByRole('button', { name: 'Edit foo' })
    expect(editBtn).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByRole('button', { name: 'Change language for foo' })).toHaveTextContent('Language: English')
    // Input is disabled and empty
    expect(input).toBeDisabled
    expect(input).toHaveValue('')

    // Clicking edit
    fireEvent.click(editBtn)
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('foo')
    expect(screen.queryAllByText('foo').length).toBeFalsy()

    // Clicking remove
    fireEvent.change(input, { target: { value: 'foobar' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    await wait(() => expect(screen.getByText('foobar')).toHaveClass('rbt-token'))
    const removeBtn = screen.getByRole('button', { name: 'Remove foobar' })
    fireEvent.click(removeBtn)

    expect(screen.queryAllByText('foobar').length).toBeFalsy()
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('')
  })

  it('allows entering a repeatable literal', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a panel property
    fireEvent.click(screen.getByRole('button', { name: 'Add Uber template1, property2' }))

    // Add two values
    const input = screen.getByPlaceholderText('Uber template1, property2')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(input, { target: { value: 'bar' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await wait(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove foo' })).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByRole('button', { name: 'Edit foo' })).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByRole('button', { name: 'Change language for foo' })).toHaveTextContent('Language: English')

    // And bar text.
    await wait(() => expect(screen.getByText('bar')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByRole('button', { name: 'Remove bar' })).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByRole('button', { name: 'Edit bar' })).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByRole('button', { name: 'Change language for bar' })).toHaveTextContent('Language: English')

    // Input is not disabled and empty
    expect(input).not.toBeDisabled
    expect(input).toHaveValue('')
  })

  it('allows entering diacritics', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'Fo' } })
    expect(input).toHaveValue('Fo')

    // Click diacritic button
    expect(screen.queryAllByText('Latin Extended').length).toBeFalsy()
    const diacriticBtn = screen.getAllByRole('button', { name: 'ä' })[0]
    fireEvent.click(diacriticBtn)

    // Click a diacritic
    fireEvent.click(screen.getByText('Latin Extended'))
    fireEvent.click(screen.getByRole('button', { name: 'ọ' }))
    expect(input).toHaveValue('Foọ')

    // Close it
    fireEvent.click(diacriticBtn)
    expect(screen.queryAllByText('Latin Extended').length).toBeFalsy()
  })

  it('allows selecting a language', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await wait(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is language button.
    const langBtn = screen.getByRole('button', { name: 'Change language for foo' })
    expect(langBtn).toHaveTextContent('Language: English')

    fireEvent.click(langBtn)
    screen.getByRole('heading', { name: 'Languages' })

    const langInput = screen.getByTestId('langComponent-foo')

    fireEvent.click(langInput)
    fireEvent.change(langInput, { target: { value: 'Tai languages' } })
    fireEvent.click(screen.getByText('Tai languages', { selector: '.rbt-highlight-text' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))


    await wait(() => expect(screen.queryAllByRole('heading', { name: 'Languages' }).length).toBeFalsy())
    expect(langBtn).toHaveTextContent('Language: Tai languages')
  })

  it('allows selecting no language', async () => {
    renderApp(null, history)

    await screen.findByRole('heading', { name: 'Uber template1' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await wait(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is language button.
    const langBtn = screen.getByRole('button', { name: 'Change language for foo' })
    expect(langBtn).toHaveTextContent('Language: English')

    fireEvent.click(langBtn)
    screen.getByRole('heading', { name: 'Languages' })

    // Using testid here because there are multiple modals.
    fireEvent.click(screen.getByTestId('noLangRadio-foo'))
    fireEvent.click(screen.getByTestId('submit-foo'))


    await wait(() => expect(screen.queryAllByRole('heading', { name: 'Languages' }).length).toBeFalsy())
    expect(langBtn).toHaveTextContent('Language: No language specified')
  })
})
