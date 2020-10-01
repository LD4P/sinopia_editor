import { fireEvent, screen, waitFor } from '@testing-library/react'
import { renderApp } from 'testUtils'
import { featureSetup } from 'featureUtils'

featureSetup()

describe('viewing the dashboard', () => {
  describe('before user interacts with Sinopia', () => {
    it('displays a welcome message', async () => {
      renderApp()

      fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))

      screen.getByText(/Welcome to Sinopia/)
    })
  })

  describe('when user uses a source template', () => {
    it('lists the resource template', async () => {
      renderApp()

      fireEvent.click(screen.getByText('Linked Data Editor', { selector: 'a' }))
      fireEvent.click(screen.getByText('Resource Templates', { selector: 'a' }))

      // The result
      await screen.findByText(/Uber template1/)

      // Click the resource template
      fireEvent.click(screen.getByText('Uber template1', { selector: 'a' }))
      await waitFor(() => expect((screen.getAllByText('Uber template1', { selector: 'h3' }))).toHaveLength(1))

      fireEvent.click(screen.getByText('Dashboard', { selector: 'a' }))

      expect(screen.queryByText(/Welcome to Sinopia/)).not.toBeInTheDocument()

      screen.getByText('Most recently used templates')

      // The result
      screen.getByText(/Uber template1/)
      screen.getByText('resourceTemplate:testing:uber1')
      screen.getByText('http://id.loc.gov/ontologies/bibframe/Uber1')
      screen.getAllByText('Justin Littman')
      screen.getByText('Jul 27, 2020')
    })
  })
})
