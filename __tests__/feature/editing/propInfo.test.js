import { renderApp, createHistory } from 'testUtils'
import { screen } from '@testing-library/react'
import Config from 'Config'

// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })
// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

describe('getting property related info from a resorce', () => {
  it('has tooltip text info or a link based on the content of a top-level property remark', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber3'])
    renderApp(null, history)

    // if the tooltip remark is text
    const infoIcon3 = await screen.findByTitle('Uber template3, property1')
    expect(infoIcon3).toHaveAttribute('data-content', 'A literal')

    // if the remark us a Url
    const infoLink = await screen.findByRole('link', { name: 'http://access.rdatoolkit.org/1.0.html' })
    expect(infoLink).toHaveClass('prop-remark')
  })

  it('has tooltip text info based on the content of a nested property remark', async () => {
    const history = createHistory(['/editor/resourceTemplate:testing:uber1'])
    renderApp(null, history)

    // Finds the parent property
    const infoIcon1 = await screen.findByTitle('Uber template1, property18')
    expect(infoIcon1).toHaveAttribute('data-content', 'Mandatory nested resource templates.')

    // Finds the nested resource
    await screen.findByRole('heading', { name: 'Uber template4' })

    // Finds the nested property info (tooltip remark is text)
    const nestedInfoIcon = await screen.findByTitle('Uber template4, property1')
    expect(nestedInfoIcon).toHaveAttribute('data-content', 'A repeatable, required literal')
  })
})
