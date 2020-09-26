import { renderApp, createHistory } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('editing a list property', () => {
  const history = createHistory(['/editor/resourceTemplate:testing:uber1'])

  it('allows selecting and removing a non-repeatable literal', async () => {
    const { container } = renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    const select = container.querySelector('select[aria-label="Select Uber template1, property10"]')
    expect(select).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'http://id.loc.gov/vocabulary/mrectype/analog' } })

    // There is analog text. Perhaps check css.
    await screen.findByText('analog', { selector: '.rbt-token' })
    // There is remove button
    expect(await screen.findByTestId('Remove analog')).toHaveTextContent('×')
    // There is no edit button.
    expect(screen.queryByTestId('Edit analog')).not.toBeInTheDocument()

    // Selector is disabled
    expect(select).toBeDisabled()

    const removeBtn = screen.getByTestId('Remove analog')
    fireEvent.click(removeBtn)

    expect(screen.queryByText('analog', { selector: '.rbt-token' })).not.toBeInTheDocument()
  }, 10000)

  it('allows entering a repeatable list', async () => {
    const { container } = renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    const select = container.querySelector('select[aria-label="Select Uber template1, property11"]')
    expect(select).toBeInTheDocument()
    fireEvent.change(select, { target: { value: 'http://id.loc.gov/vocabulary/mrectype/analog' } })

    await screen.findByText('analog', { selector: '.rbt-token' })

    expect(select).not.toBeDisabled()

    fireEvent.change(select, { target: { value: 'http://id.loc.gov/vocabulary/mrectype/digital' } })

    await screen.findByText('digital', { selector: '.rbt-token' })
  }, 10000)

  it('displays items from multiple authorities', async () => {
    const { container } = renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    expect(container.querySelector('div[data-label="Uber template1, property12"] option[value="http://id.loc.gov/vocabulary/mrectype/analog"]')).toBeInTheDocument()
    expect(container.querySelector('div[data-label="Uber template1, property12"] option[value="http://id.loc.gov/vocabulary/mrecmedium/mag"]')).toBeInTheDocument()
  })
})
