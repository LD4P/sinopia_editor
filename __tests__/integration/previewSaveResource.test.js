import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import { renderWithRedux, createReduxStore } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'

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
      resource: {
        'resourceTemplate:bf2:WorkTitle': {
          'http://id.loc.gov/ontologies/bibframe/mainTitle': {
            items: {
              Uv8UAARr8: {
                content: 'foo',
                lang: 'en',
              },
            },
          },
        },
      },
      entities: {
        languages: {
          loading: false,
          options: [
            {
              id: 'en',
              label: 'English',
            },
          ],
        },
        resourceTemplateSummaries: {
          'resourceTemplate:bf2:WorkTitle': {
            key: 'resourceTemplate:bf2:WorkTitle',
            name: 'Work Title',
            id: 'resourceTemplate:bf2:WorkTitle',
            group: 'ld4p',
          },
        },
        resourceTemplates: {
          'resourceTemplate:bf2:WorkTitle': {
            id: 'resourceTemplate:bf2:WorkTitle',
            resourceLabel: 'Work Title',
            resourceURI: 'http://id.loc.gov/ontologies/bibframe/Title',
            propertyTemplates: [
              {
                propertyURI: 'http://id.loc.gov/ontologies/bibframe/mainTitle',
                propertyLabel: 'Preferred Title for Work',
                remark: 'http://access.rdatoolkit.org/rdachp6_rda6-2036.html',
                mandatory: 'false',
                repeatable: 'true',
                type: 'literal',
                resourceTemplates: [],
                valueConstraint: {
                  valueTemplateRefs: [],
                  useValuesFrom: [],
                  valueDataType: {},
                  defaults: [],
                },
              },
            ],
          },
        },
      },
      editor: {
        resourceValidationErrors: {},
        errors: [],
        copyToNewMessage: {},
        rdfPreview: {
          show: true,
        },
        groupChoice: {
          show: false,
        },
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
    },
  }
}

describe('Preview and save resource', () => {
  const store = createReduxStore(createInitialState())
  const {
    getByText, queryByText, queryAllByText, getByTestId, getByTitle,
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('opens the resource, previews RDF, and saves', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Editor'))

    // Preview the RDF
    fireEvent.click(getByTitle('Preview RDF'))
    expect(getByText(/<> <http:\/\/id.loc.gov\/ontologies\/bibframe\/mainTitle> "foo"@en \./)).toBeInTheDocument()

    // Save
    // There are multiple of these on screen, so selecting by id.
    // There is probably a more idiomatic way of doing this.
    const save = queryAllByText('Save').find((btn) => {
      return btn.id === 'modal-save'
    })
    fireEvent.click(save)
    expect(queryByText('Which group do you want to save to?')).toBeInTheDocument()
    // Having trouble with finding by label text, so using test id
    fireEvent.change(getByTestId('groupSelect'), { target: { value: 'stanford' } })

    // There are multiple of these on screen, so selecting by id
    const finalSave = queryAllByText('Save').find((btn) => {
      return btn.id !== 'modal-save' && btn.id !== 'editor-save'
    })
    fireEvent.click(finalSave)

    await wait(() => expect(queryByText('Which group do you want to save to?')).not.toBeInTheDocument())
  })
})
