import { renderApp } from 'testUtils'
import { fireEvent, wait, screen } from '@testing-library/react'
import * as sinopiaSearch from 'sinopiaSearch'
import Config from 'Config'

jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

jest.mock('sinopiaSearch')

describe('loading from RDF', () => {
  describe('when RDF', () => {
    it('opens the resource', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      const rdf = `
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(screen.getByLabelText('RDF'), { target: { value: rdf } })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      expect((await screen.findAllByRole('heading', { name: 'Abbreviated Title' })).length).toBeTruthy()

      screen.getByText('foo')
    })
  })

  describe('when RDF with base URI', () => {
    it('opens the resource', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      const rdf = `
<http://sinopia/c73d2fa9> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<http://sinopia/c73d2fa9> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<http://sinopia/c73d2fa9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(screen.getByLabelText('RDF'), { target: { value: rdf } })
      fireEvent.change(screen.getByLabelText('Base URI'), { target: { value: 'http://sinopia/c73d2fa9' } })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      expect((await screen.findAllByRole('heading', { name: 'Abbreviated Title' })).length).toBeTruthy()

      screen.getByText('foo')
    })
  })

  describe('when RDF with base URI but base URI not provided', () => {
    it('displays error', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      const rdf = `
<http://sinopia/c73d2fa9> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<http://sinopia/c73d2fa9> <http://sinopia.io/vocabulary/hasResourceTemplate> "ld4p:RT:bf2:Title:AbbrTitle" .
<http://sinopia/c73d2fa9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(screen.getByLabelText('RDF'), { target: { value: rdf } })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      await screen.findByText('Base URI must be provided.')
    })
  })

  describe('when RDF without resource template provided', () => {
    sinopiaSearch.getTemplateSearchResults.mockResolvedValue({
      totalHits: 1,
      results: [{
        id: 'ld4p:RT:bf2:Title:AbbrTitle',
        resourceLabel: 'Abbreviated Title',
        resourceURI: 'http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle',
      }],
      error: undefined,
    })

    it('asks for the resource template id', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      const rdf = `
<> <http://id.loc.gov/ontologies/bibframe/mainTitle> "foo"@eng .
<> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://id.loc.gov/ontologies/bibframe/AbbreviatedTitle> .
      `

      fireEvent.change(screen.getByLabelText('RDF'), { target: { value: rdf } })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      await wait(() => {
        expect(screen.getByText('Choose resource template')).toBeVisible()
      })

      fireEvent.change(screen.getByPlaceholderText(/Enter id, label/), { target: { value: 'ld4p:RT:bf2:Title:AbbrTitle' } })
      fireEvent.click(await screen.findByText(/Abbreviated Title/))
      fireEvent.click(screen.getByRole('button', { name: 'Save' }))

      expect((await screen.findAllByText('Abbreviated Title')).length).toBeTruthy()

      screen.getByText('foo')
    })
  })

  describe('when invalid RDF', () => {
    it('displays error', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      fireEvent.change(screen.getByLabelText('RDF'), { target: { value: 'xyz' } })
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }))

      await screen.findByText(/Error parsing/)
    })
  })

  describe('when no RDF', () => {
    it('disables submit', async () => {
      renderApp()

      fireEvent.click(screen.getByRole('link', { name: 'Linked Data Editor' }))
      fireEvent.click(screen.getByRole('link', { name: 'Load RDF' }))

      screen.getByText('Load RDF into Editor')

      const submitBtn = screen.getByRole('button', { name: 'Submit' })
      expect(submitBtn).toBeDisabled()
    })
  })
})
