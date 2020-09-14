import { renderApp } from 'testUtils'
import { fireEvent, screen } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import { resourceSearchResults } from 'fixtureLoaderHelper'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

jest.mock('sinopiaSearch')
// Mock jquery
global.$ = jest.fn().mockReturnValue({ popover: jest.fn() })

describe('loading saved resource', () => {
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    totalHits: 0,
    results: [],
    error: undefined,
  })
  describe('when RDF', () => {
    it('opens the resource', async () => {
      const uri = 'http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

      renderApp()

      fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
      fireEvent.click(screen.getByText('Search', { selector: 'a' }))

      fireEvent.change(screen.getByLabelText('Query'), { target: { value: uri } })
      fireEvent.click(screen.getByTestId('Submit search'))

      // The result
      await screen.findByText(uri)
      screen.getByText('http://id.loc.gov/ontologies/bibframe/Fixture')
      screen.getByText('Stanford University')
      screen.getByText('Jul 15, 2020')

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))
      expect((await screen.findAllByText('Uber template1', { selector: 'h3' }))).toHaveLength(1)

      // URI displayed
      screen.getByText(`URI for this resource: <${uri}>`)

      // Headings
      screen.getByText('Uber template1', { selector: 'h3' })
      screen.getByText('Uber template1, property1', { selector: 'span' })
      screen.getAllByText('Uber template2', { selector: 'h5' })
      screen.getByText('Uber template3', { selector: 'h5' })
      // Length is the heading and the value.
      expect(screen.getAllByText('Uber template3, property1')).toHaveLength(2)
      expect(screen.getAllByText('Uber template3, property2')).toHaveLength(2)
      expect(screen.getAllByText('Uber template1, property2')).toHaveLength(2)
      // Heading appears twice, value once.
      expect(screen.getAllByText('Uber template2, property1')).toHaveLength(3)

      // Show input components
      screen.getByTestId('Hide Uber template3, property1')
      screen.getByTestId('Hide Uber template3, property2')
      expect(screen.getAllByTestId('Hide Uber template2, property1')).toHaveLength(2)
      screen.getByPlaceholderText('Uber template3, property1')
      screen.getByPlaceholderText('Uber template3, property2')
      screen.getByPlaceholderText('Uber template1, property2')
    })
  })

  describe('when invalid resource template', () => {
    it('displays error', async () => {
      const uri = 'http://localhost:3000/resource/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid'
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

      renderApp()

      fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
      fireEvent.click(screen.getByText('Search', { selector: 'a' }))

      fireEvent.change(screen.getByLabelText('Query'), { target: { value: uri } })
      fireEvent.click(screen.getByTestId('Submit search'))

      // The result
      await screen.findByText(uri)
      screen.getByText('http://id.loc.gov/ontologies/bibframe/Fixture')
      screen.getByText('Stanford University')
      screen.getByText('Jul 15, 2020')

      // Click edit
      fireEvent.click(screen.getByTestId(`Edit ${uri}`))

      // Error displayed and remain on search page.
      screen.getByLabelText('Query')
      await screen.findByText(/Repeated property templates/)
    })
  })
})
