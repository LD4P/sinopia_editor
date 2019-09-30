import React from 'react'
import { fireEvent } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'
import Config from 'Config'

// This forces Sinopia server to use fixtures
jest.spyOn(Config, 'useResourceTemplateFixtures', 'get').mockReturnValue(true)

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
  setupModal()
  const store = createReduxStore(createInitialState())
  const app = (<MemoryRouter><App /></MemoryRouter>)
  const { getByText, findByText } = renderWithRedux(
    app, store,
  )

  it('notifies the user that misconfigured', async () => {
    // Selects the resource template
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('test lookup type misconfigured with valueTemplateRefs'))

    expect(await findByText(/The following property templates have unknown types or lookups/)).toBeInTheDocument()
  })
})
