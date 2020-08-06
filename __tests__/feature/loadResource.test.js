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
  // sinopiaServer.foundResourceTemplate.mockResolvedValue(true)
  // sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  // sinopiaServer.loadRDFResource.mockImplementation(getFixtureResource)
  sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
    totalHits: 0,
    results: [],
    error: undefined,
  })
  describe('when RDF', () => {
    it('opens the resource', async () => {
      const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f'
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Search' }))

      fireEvent.change(screen.getByLabelText('Query'), { target: { value: uri } })
      fireEvent.click(screen.getByRole('button', { name: 'submit search' }))

      // The result
      await screen.findByText(uri)
      screen.getByText('http://id.loc.gov/ontologies/bibframe/Fixture')
      screen.getByText('Stanford University')
      screen.getByText('Jul 15, 2020')

      // Click edit
      fireEvent.click(screen.getByRole('button', { name: `Edit ${uri}` }))
      expect((await screen.findAllByRole('heading', { name: 'Uber template1' }))).toHaveLength(1)

      // URI displayed
      screen.getByText(`URI for this resource: <${uri}>`)

      // Headings
      screen.getByRole('heading', { name: 'Uber template1' })
      screen.getByRole('heading', { name: /Uber template1, property1 / })
      expect(screen.getAllByRole('heading', { name: 'Uber template2' })).toHaveLength(2)
      screen.getByRole('heading', { name: 'Uber template3' })
      // Length is the heading and the value.
      expect(screen.getAllByText('Uber template3, property1')).toHaveLength(2)
      expect(screen.getAllByText('Uber template3, property2')).toHaveLength(2)
      expect(screen.getAllByText('Uber template1, property2')).toHaveLength(2)
      // Heading appears twice, value once.
      expect(screen.getAllByText('Uber template2, property1')).toHaveLength(3)

      // Show input components
      screen.getByRole('button', { name: 'Hide Uber template3, property1' })
      screen.getByRole('button', { name: 'Hide Uber template3, property2' })
      expect(screen.getAllByRole('button', { name: 'Hide Uber template2, property1' })).toHaveLength(2)
      screen.getByPlaceholderText('Uber template3, property1')
      screen.getByPlaceholderText('Uber template3, property2')
      screen.getByPlaceholderText('Uber template1, property2')
    })
  })

  describe('when invalid resource template', () => {
    it('displays error', async () => {
      const uri = 'http://localhost:3000/repository/c7db5404-7d7d-40ac-b38e-c821d2c3ae3f-invalid'
      sinopiaSearch.getSearchResultsWithFacets.mockResolvedValue(resourceSearchResults(uri))

      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Search' }))

      fireEvent.change(screen.getByLabelText('Query'), { target: { value: uri } })
      fireEvent.click(screen.getByRole('button', { name: 'submit search' }))

      // The result
      await screen.findByText(uri)
      screen.getByText('http://id.loc.gov/ontologies/bibframe/Fixture')
      screen.getByText('Stanford University')
      screen.getByText('Jul 15, 2020')

      // Click edit
      fireEvent.click(screen.getByRole('button', { name: `Edit ${uri}` }))

      // Error displayed and remain on search page.
      screen.getByLabelText('Query')
      await screen.findByText(/Repeated property templates/)
    })
  })
})
