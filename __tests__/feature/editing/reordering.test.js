import Config from 'Config'
import { renderApp, createHistory } from 'testUtils'
import {
  fireEvent, screen, getAllByPlaceholderText, getByTestId, waitFor,
} from '@testing-library/react'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('reordering properties', () => {
  it('reorders nested properties', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber1'])
    const { container } = renderApp(null, history)

    await screen.findByText('Uber template1', { selector: 'h3' })

    // Add a panel property
    screen.getByText('Uber template1, property19', { selector: 'span' })
    fireEvent.click(screen.getByTestId('Add Uber template1, property19'))

    await screen.findByText('Uber template4')

    const nestedResource1 = container.querySelector('div[data-label="Uber template1, property19"] div.nested-resource')

    // No arrows.
    expect(nestedResource1.querySelector('.btn-moveup')).toBeFalsy()
    expect(nestedResource1.querySelector('.btn-movedown')).toBeFalsy()

    // Add a value
    const inputs1 = getAllByPlaceholderText(nestedResource1, 'Uber template4, property1')
    fireEvent.change(inputs1[0], { target: { value: 'a' } })
    fireEvent.keyPress(inputs1[0], { key: 'Enter', code: 13, charCode: 13 })

    // Add more nested resources
    const panel = container.querySelector('div[data-label="Uber template1, property19"]')
    fireEvent.click(getByTestId(panel, 'Add another Uber template4'))
    fireEvent.click(getByTestId(panel, 'Add another Uber template4'))
    await waitFor(() => expect(container.querySelectorAll('div[data-label="Uber template1, property19"] div.nested-resource')).toHaveLength(3))

    const inputs2 = getAllByPlaceholderText(panel, 'Uber template4, property1')
    fireEvent.change(inputs2[1], { target: { value: 'b' } })
    fireEvent.keyPress(inputs2[1], { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.change(inputs2[2], { target: { value: 'c' } })
    fireEvent.keyPress(inputs2[2], { key: 'Enter', code: 13, charCode: 13 })

    const nestedResources1 = container.querySelectorAll('div[data-label="Uber template1, property19"] div.nested-resource')

    // First has down arrow.
    expect(nestedResources1[0].querySelector('.btn-moveup')).toBeFalsy()
    expect(nestedResources1[0].querySelector('.btn-movedown')).toBeTruthy()
    // Second has up and down arrow
    expect(nestedResources1[1].querySelector('.btn-moveup')).toBeTruthy()
    expect(nestedResources1[1].querySelector('.btn-movedown')).toBeTruthy()
    // Third has up arrow
    expect(nestedResources1[2].querySelector('.btn-moveup')).toBeTruthy()
    expect(nestedResources1[2].querySelector('.btn-movedown')).toBeFalsy()

    // Move "b" up
    nestedResources1[1].querySelector('.btn-moveup').click()
    const values1 = panel.querySelectorAll('div.rbt-token')
    expect(values1[0]).toHaveTextContent(/b/)
    expect(values1[1]).toHaveTextContent(/a/)
    expect(values1[2]).toHaveTextContent(/c/)

    // Move "a" down
    nestedResources1[0].querySelector('.btn-movedown').click()
    const values2 = panel.querySelectorAll('div.rbt-token')
    expect(values2[0]).toHaveTextContent(/b/)
    expect(values2[1]).toHaveTextContent(/c/)
    expect(values2[2]).toHaveTextContent(/a/)
  }, 20000)
})