import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
// eslint-disable-next-line import/no-unresolved
import { renderWithRedux, createReduxStore, setupModal } from 'testUtils'
import App from 'components/App'
import { MemoryRouter } from 'react-router-dom'

const createInitialState = () => {
  // Note that making mandatory
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
                mandatory: 'true',
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
          show: false,
        },
        groupChoice: {
          show: false,
        },
        lastSaveChecksum: '54527c024d0021784f666c2794856938',
        displayValidations: false,
      },
      appVersion: {
        version: undefined,
        lastChecked: Date.now(),
      },
    },
  }
}

describe('Preview and try to save resource', () => {
  const store = createReduxStore(createInitialState())
  setupModal()
  const {
<<<<<<< HEAD
    getByText, getByTitle, queryByText, queryAllByText, getByPlaceholderText,
=======
    getByText, getByTitle, getByTestId, queryAllByText, queryByText,
>>>>>>> Continue refactoring of modals to use Redux
  } = renderWithRedux(
    (<MemoryRouter><App /></MemoryRouter>), store,
  )

  it('opens the resource, previews RDF, and displays validation', async () => {
    // Open the resource
    fireEvent.click(getByText('Linked Data Editor'))
    fireEvent.click(getByText('Editor'))

    // Add and remove something to trigger validation
    fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })
    fireEvent.click(getByText('×'))

    // Preview the RDF
    const previewBtn = getByTitle('Preview RDF')

    fireEvent.click(previewBtn)
    await wait(() => {
      expect(rdfModal.classList.contains('show')).toBe(true)
    })

    expect(getByText(/<> <http:\/\/sinopia.io\/vocabulary\/hasResourceTemplate> "resourceTemplate:bf2:WorkTitle" ./)).toBeInTheDocument()

    // Save
    // There are multiple of these on screen, so selecting by id.
    // There is probably a more idiomatic way of doing this.
    const saveAndPublish = queryAllByText('Save').find((btn) => {
      return btn.id === 'modal-save'
    })
    expect(saveAndPublish).not.toBeDisabled()
    fireEvent.click(saveAndPublish)
    await wait(() => {
      // All modals closed
      expect(rdfModal.classList.contains('show')).not.toBe(true)
    })
    expect(groupChoiceModal.classList.contains('show')).not.toBe(true)
    expect(queryByText(/There was a problem saving this resource/)).toBeInTheDocument()
    expect(queryByText('Required')).toBeInTheDocument()
    expect(getByText('Save')).toBeDisabled()

    // Fix the problem
    fireEvent.change(getByPlaceholderText('Preferred Title for Work'), { target: { value: 'foo' } })
    fireEvent.keyPress(getByPlaceholderText('Preferred Title for Work'), { key: 'Enter', code: 13, charCode: 13 })

    expect(queryByText('Required')).not.toBeInTheDocument()
    expect(getByText('Save')).not.toBeDisabled()
  })
})
