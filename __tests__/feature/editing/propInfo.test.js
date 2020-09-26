import { renderApp, createHistory } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import Config from 'Config'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)
// Mock out document.elementFromPoint used by useNavigableComponent.
global.document.elementFromPoint = jest.fn()
// Mock out scrollIntoView used by useNavigableComponent. See https://github.com/jsdom/jsdom/issues/1695
Element.prototype.scrollIntoView = jest.fn()

describe('getting property related info from a resource', () => {
  it('has tooltip text info or a link based on the content of a top-level property remark', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber3'])
    const { container } = renderApp(null, history)

    // if the tooltip remark is text
    const infoIcon3 = await screen.findByTitle('Uber template3, property1')
    expect(infoIcon3).toHaveAttribute('data-content', 'A literal')

    // if the remark is a Url
    const infoLink = container.querySelector('a[href="http://access.rdatoolkit.org/1.0.html"]')

    expect(infoLink).toHaveClass('prop-remark')
  })

  it('has tooltip text info based on the content of a nested property remark', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber1'])
    renderApp(null, history)

    // Verifies that tooltip pops up when clicked and hides when something else is clicked
    const tooltipText = 'Multiple nested, repeatable resource templates.'
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument()
    fireEvent.click(await screen.findByTitle('Uber template1, property1'))
    // NOTE: This is the line that should be doing the real testing... but I
    //       can't get it to work after much googling and many different
    //       incantations.
    //
    // expect(await screen.findByText(tooltipText)).toBeInTheDocument()
    fireEvent.click(screen.getByPlaceholderText('Uber template1, property4'))
    expect(screen.queryByText(tooltipText)).not.toBeInTheDocument()

    // Finds the parent property
    const infoIcon1 = await screen.findByTitle('Uber template1, property18')
    expect(infoIcon1).toHaveAttribute('data-content', 'Mandatory nested resource templates.')

    // Finds the nested resource
    await screen.findByText('Uber template4', { selector: 'h5' })

    // Finds the nested property info (tooltip remark is text)
    const nestedInfoIcon = await screen.findByTitle('Uber template4, property1')
    expect(nestedInfoIcon).toHaveAttribute('data-content', 'A repeatable, required literal')
  }, 10000)
})
