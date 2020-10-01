import { renderApp, createHistory } from 'testUtils'
import { fireEvent, waitFor, screen } from '@testing-library/react'
import { featureSetup } from 'featureUtils'

featureSetup()

describe('editing a literal property', () => {
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('allows entering, editing, and removing a non-repeatable literal', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text. Perhaps check css.
    await waitFor(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByTestId('Remove foo')).toHaveTextContent('×')
    // There is edit button.
    const editBtn = screen.getByTestId('Edit foo')
    expect(editBtn).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByTestId('Change language for foo')).toHaveTextContent('Language: English')
    // Input is disabled and empty
    expect(input).toBeDisabled()
    expect(input).toHaveValue('')

    // Clicking edit
    fireEvent.click(editBtn)
    expect(input).not.toBeDisabled()
    expect(input).toHaveValue('foo')
    expect(screen.queryAllByText('foo').length).toBeLessThan(2)

    // Clicking remove
    fireEvent.change(input, { target: { value: 'foobar' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    await waitFor(() => expect(screen.getByText('foobar')).toHaveClass('rbt-token'))
    const removeBtn = screen.getByTestId('Remove foobar')
    fireEvent.click(removeBtn)

    expect(screen.queryAllByText('foobar')).toHaveLength(0)
    expect(input).not.toBeDisabled()
    expect(input).toHaveValue('')
  }, 15000)

  it('allows entering a repeatable literal', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add two values
    const input = screen.getByPlaceholderText('Uber template1, property2')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(input, { target: { value: 'bar' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByTestId('Remove foo')).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByTestId('Edit foo')).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByTestId('Change language for foo')).toHaveTextContent('Language: English')

    // And bar text.
    await waitFor(() => expect(screen.getByText('bar')).toHaveClass('rbt-token'))
    // There is remove button
    expect(screen.getByTestId('Remove bar')).toHaveTextContent('×')
    // There is edit button.
    expect(screen.getByTestId('Edit bar')).toHaveTextContent('Edit')
    // There is language button.
    expect(screen.getByTestId('Change language for bar')).toHaveTextContent('Language: English')

    // Input is not disabled and empty
    expect(input).not.toBeDisabled()
    expect(input).toHaveValue('')
  }, 15000)

  it('allows entering diacritics', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'Fo' } })
    expect(input).toHaveValue('Fo')

    // Click diacritic button
    expect(screen.queryAllByText('Latin Extended')).toHaveLength(0)
    const diacriticBtn = screen.getAllByText('ä')[1]
    fireEvent.click(diacriticBtn)

    // Click a diacritic
    fireEvent.click(screen.getByText('Latin Extended'))
    fireEvent.click(screen.getByText('ọ'))
    expect(input).toHaveValue('Foọ')

    // Close it
    fireEvent.click(diacriticBtn)
    expect(screen.queryAllByText('Latin Extended')).toHaveLength(0)
  }, 15000)

  it('allows selecting a language', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is language button.
    const langBtn = screen.getByTestId('Change language for foo')
    expect(langBtn).toHaveTextContent('Language: English')

    fireEvent.click(langBtn)
    // Using getByRole here and below because it limits to the visible modal.
    screen.getByRole('heading', { name: 'Languages' })

    const langInput = screen.getByTestId('langComponent-foo')

    fireEvent.click(langInput)
    fireEvent.change(langInput, { target: { value: 'Tai languages' } })
    fireEvent.click(screen.getByText('Tai languages', { selector: '.rbt-highlight-text' }))
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

    await waitFor(() => expect(screen.queryAllByRole('heading', { name: 'Languages' }).length).toBeFalsy())
    expect(langBtn).toHaveTextContent('Language: Tai languages')
  }, 25000)

  it('allows selecting no language', async () => {
    renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a value
    const input = screen.getByPlaceholderText('Uber template1, property4')
    fireEvent.change(input, { target: { value: 'foo' } })
    fireEvent.keyPress(input, { key: 'Enter', code: 13, charCode: 13 })

    // There is foo text.
    await waitFor(() => expect(screen.getByText('foo')).toHaveClass('rbt-token'))
    // There is language button.
    const langBtn = screen.getByTestId('Change language for foo')
    expect(langBtn).toHaveTextContent('Language: English')

    fireEvent.click(langBtn)
    screen.getByRole('heading', { name: 'Languages' })

    // Using testid here because there are multiple modals.
    fireEvent.click(screen.getByTestId('noLangRadio-foo'))
    fireEvent.click(screen.getByTestId('submit-foo'))

    await waitFor(() => expect(screen.queryAllByRole('heading', { name: 'Languages' })).toHaveLength(0))
    expect(langBtn).toHaveTextContent('Language: No language specified')
  }, 15000)
})
