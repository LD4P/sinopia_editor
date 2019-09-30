import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import * as sinopiaServer from 'sinopiaServer'
import { getFixtureResourceTemplate } from '../fixtureLoaderHelper'

jest.mock('sinopiaServer')

const createInitialState = () => {
  return {
    authenticate: {
      authenticationState: {
        currentSession: {
          idToken: {},
        },
      },
    },
    selectorReducer: {
      resource: {},
      entities: {
        resourceTemplateSummaries: {},
        resourceTemplates: {},
        languages: {
          loading: false,
          options: [
            {
              id: 'en',
              label: 'English',
            },
          ],
        },
      },
      editor: {
        resourceValidationErrors: {},
        rdfPreview: {
          show: true,
        },
        groupChoice: {
          show: false,
        },
        expanded: {},
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
    },
  }
}

describe('Loading a misconfigured property template', () => {
  sinopiaServer.getResourceTemplate.mockImplementation(getFixtureResourceTemplate)
  sinopiaServer.listResourcesInGroupContainer.mockResolvedValue({ response: { body: { contains: ['Sinopia:RT:Fixture:LookupWithValueTemplateRefs'] } } })
  const store = createReduxStore(createInitialState())
  const app = (<MemoryRouter><App /></MemoryRouter>)
  const {
    getByText, queryByText, container,
  } = renderWithRedux(
    app, store,
  )

  it('notifies the user that misconfigured', async () => {
    // Selects the resource template
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('test lookup type misconfigured with valueTemplateRefs'))

    // Clicks add to view the error
    await wait(() => container.querySelector('button.btn-add[data-id="lookup1"]'))
    fireEvent.click(container.querySelector('button.btn-add[data-id="lookup1"]'))

    await wait(() => expect(queryByText('This propertyTemplate is misconfigured.')).toBeInTheDocument())
  })
})
